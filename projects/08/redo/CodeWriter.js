const fs = require('fs');
const path = require('path');
const { COMMAND } = require('./Parser');

const RAM = {
  local: 'LCL',
  argument: 'ARG',
  this: 'THIS',
  that: 'THAT'
};


class CodeWriter {
  constructor(asmFile) {
    this.code = [];
    this.outputFile = asmFile;
    this.labelcount = 0;
    this.currentFunction = 'glob';
    this.functionCallCount = {}; // This is required to return to correct location label
  }

  setFileName(filename) {
    this.currentFile = filename.replace(path.extname(filename), '');
  }

  writeUnary(command) {
    let oper = null;
    if (command === 'neg') {
      oper = '-';
    } else if (command === 'not') {
      oper = '!';
    } else {
      return;
    }

    this.code.push(`
    @SP
    AM=M-1 // pop
    M=${oper}M
    @SP
    M=M+1 // SP++`);
  }

  writeCompare(command) {
    let jump = null;
    if (command === 'eq') {
      jump = 'JEQ';
    } else if (command === 'gt') {
      jump = 'JGT';
    } else if (command === 'lt') {
      jump = 'JLT';
    } else {
      return;
    }

    const ifLabel = `IF-${this.currentFile}-${this.labelcount}`;
    const endifLabel = `ENDIF-${this.currentFile}-${this.labelcount}`;
    this.labelcount++; // we have used the label

    this.code.push(`
  @SP
  AM=M-1 // pop
  D=M // D=*SP (y)
  @SP
  AM=M-1 // pop
  D=M-D // D=x-y
  @${ifLabel}
  D;${jump} 
  // false
  @SP
  A=M
  M=0
  @${endifLabel}
  0;JMP
  (${ifLabel})
  // true
  @SP
  A=M
  M=-1
  (${endifLabel})
  @SP
  M=M+1 // SP++`);
  }

  writeArithmetic(command) {
    this.code.push(`// ${command}`);

    const isUnary = command === 'neg' || command === 'not';
    if (isUnary) {
      this.writeUnary(command);
      return;
    }

    const isCompare = command === 'eq' || command === 'gt' || command === 'lt';
    if (isCompare) {
      this.writeCompare(command);
      return;
    }

    // commands with two operands
    let oper = null;
    switch (command) {
      case 'add':
        oper = '+';
        break;
      case 'sub':
        oper = '-';
        break;
      case 'and':
        oper = '&';
        break;
      case 'or':
        oper = '|';
        break;
      case 'not':
        oper = '!';
        break;
      default:
        console.error(`Unknown command ${command}`);
    }

    this.code.push(`
    @SP
    AM=M-1 // pop
    D=M // D=*SP (y)
    @SP
    AM=M-1 // pop
    M=M${oper}D // *SP=x(oper)y
    @SP
    M=M+1 // SP++`);
  }

  pushConstant(index) {
    this.code.push(`
    @${index}
    D=A // D=value
    @SP
    A=M
    M=D // *SP=value
    @SP
    M=M+1 // SP++`);
  }

  pushSegment(segment, index) {
    this.code.push(`
    @${index}
    D=A
    @${RAM[segment]}
    A=D+M 
    D=M

    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++`);
  }

  popSegment(segment, index) {
    this.code.push(`
    @SP
    AM=M-1 // SP--

    @${index}
    D=A
    @${RAM[segment]}
    D=M+D // addr = base_addr + index
    @R13 
    M=D
    @SP
    A=M
    D=M // D=*SP

    @R13
    A=M
    M=D`);
  }

  pushRegister(ram) {
    this.code.push(`
    @${ram}
    D=M
    @SP
    A=M
    M=D // *SP=*addr
    @SP
    M=M+1 // SP++`);
  }

  popRegister(ram) {
    this.code.push(`
    @SP
    AM=M-1 // SP--
    D=M  // D=*SP
    @${ram}
    M=D // *addr=D`);
  }

  writePushPop(command, segment, index) {
    this.code.push(`// ${command === COMMAND.C_PUSH ? 'push' : 'pop'} ${segment} ${index}`);

    if (segment === 'constant') {
      this.pushConstant(index);
    } else if (segment === 'temp') {
      const ram = `R${Number(index) + 5}`;
      command === COMMAND.C_PUSH ? this.pushRegister(ram) : this.popRegister(ram);
    } else if (segment === 'static') {
      const ram = `${this.currentFile}.${index}`;
      command === COMMAND.C_PUSH ? this.pushRegister(ram) : this.popRegister(ram);
    } else if (segment === 'pointer') {
      const ram = Number(index) === 0 ? 'THIS' : 'THAT';
      command === COMMAND.C_PUSH ? this.pushRegister(ram) : this.popRegister(ram);
    } else {
      command === COMMAND.C_PUSH ? this.pushSegment(segment, index) : this.popSegment(segment, index);
    }
  }

  /**
   * Writes assembly code that effects the VM initialization, also called bootstrap code
   * This code must be placed at the beginning of the output file
   */
  writeInit() {
    this.code.push(`
    // bootstrap
    @256
    D=A
    @SP
    M=D`);

    this.writeCall('Sys.init', 0);
  }

  getLabelSymbol(label) {
    return `${this.currentFunction}$${label}`;
  }

  writeLabel(label) {
    this.code.push(`(${this.getLabelSymbol(label)})`);
  }

  writeGoto(label) {
    this.code.push(`
// goto ${label}
    @${this.getLabelSymbol(label)}
    0;JMP`);
  }

  writeIf(label) {
    this.code.push(`
// if-goto ${label}
    @SP
    AM=M-1 // pop
    D=M
    @${this.getLabelSymbol(label)}
    D;JNE
    `);
  }

  writeCall(functionName, numArgs) {

    if (!(functionName in this.functionCallCount)) {
      this.functionCallCount[functionName] = 0;
    }

    const callCount = this.functionCallCount[functionName];
    const returnLabel = `${functionName}.ret.${callCount}`;
    this.functionCallCount[functionName]++; // we have used up the call count

    this.code.push(`
// call ${functionName} ${numArgs}
    
    // push return-address
    @${returnLabel}
    D=A
    @SP
    A=M
    M=D
    @SP
    M=M+1`);

    // save registers in the stack
    ['LCL', 'ARG', 'THIS', 'THAT'].forEach((ram) => {
      this.code.push(`
    // push ${ram}
    @${ram}
    D=M
    @SP
    A=M
    M=D
    @SP
    M=M+1`);
    });

    // change ARG
    this.code.push(`
    @${numArgs}
    D=A
    @5
    D=D+A 
    @SP
    D=M-D 
    @ARG
    M=D // ARG=SP-(n+5)`);

    // change LCL
    this.code.push(`
    @SP
    D=M
    @LCL
    M=D // LCL=SP`);

    // jump to the function
    this.code.push(`
    @${functionName}
    0;JMP`);

    // return address label
    this.code.push(`(${returnLabel})`);

  }

  writeReturn() {
    this.code.push(`// function return`);
    
    this.code.push(`
// FRAME=LCL
    @LCL
    D=M
    @FRAME
    M=D
// RET=*(FRAME-5)
    @5
    A=D-A
    D=M
    @RET
    M=D
// *ARG = pop()
    @SP
    AM=M-1
    D=M
    @ARG
    A=M
    M=D
// SP = ARG+1
    @ARG
    D=M+1
    @SP
    M=D
// THAT = *(FRAME-1)
    @FRAME
    A=M-1
    D=M
    @THAT
    M=D
// THIS = *(FRAME-2)
    @2
    D=A
    @FRAME
    A=M-D
    D=M
    @THIS
    M=D
// ARG = *(FRAME-3)
    @3
    D=A
    @FRAME
    A=M-D
    D=M
    @ARG
    M=D
// LCL = *(FRAME-4)
    @4
    D=A
    @FRAME
    A=M-D
    D=M
    @LCL
    M=D
// goto RET
    @RET
    A=M
    0;JMP`);
  }

  writeFunction(functionName, numLocals) {
    this.currentFunction = functionName;

    this.code.push(`// function ${functionName} ${numLocals}`);

    // Label for the function
    this.code.push(`(${functionName})`);

    this.code.push(`// initialize local variables`);
    // init local variables
    for (let i = 0; i < Number(numLocals); ++i) {
      this.code.push(`
    @SP
    A=M
    M=0
    @SP
    M=M+1`);
    }
  }

  close() {
    // flush the output to the file
    fs.writeFileSync(this.outputFile, this.code.join('\n'));
    this.currentFile = null;
  }
}

module.exports = { CodeWriter };
