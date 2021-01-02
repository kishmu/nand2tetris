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
    D=D+M // D=addr (index + segment_base_addr)
    A=D
    D=M // D=*addr

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

  close() {
    // flush the output to the file
    fs.writeFileSync(this.outputFile, this.code.join('\n'));
    this.currentFile = null;
  }
}

module.exports = { CodeWriter };
