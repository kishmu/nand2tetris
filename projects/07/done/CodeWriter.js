const fs = require('fs');
const Parser = require('./Parser');
const path = require('path');

class CodeWriter {
  /**
   * open the output file stream and get ready to write to it
   */
  constructor(outputFile) {
    // We will write the file on close(). The contents will be in memory until then
    this.lines = [];
    this.outputFile = outputFile;
    this.labelnum = 0;
    this.staticLabel = path.basename(outputFile).replace(/\.asm$/, '');
  }

  /** inform the code writer that the translation of a new VM file is started
   */
  setFileName(fileName) {
    // not used
  }

  /** write the assembly code that is the translation of the given arithmetic command
   * arithmetic & logical commands: add, sub, neg, eq, gt, lt, and, or, not
   */
  writeArithmetic(command) {
    let code = [`// ${command}`]; // start with comment
    let oper;
    switch (command) {
      case 'add':
        oper = oper || 'M=M+D';
      case 'sub':
        oper = oper || 'M=M-D';
      case 'and':
        oper = oper || 'M=D&M';
      case 'or':
        oper = oper || 'M=D|M';
        code = code.concat([
          // stack: x, y  : result x-y
          // SP--, D=*SP, SP--, *SP = *SP oper D, SP++
          '@SP',
          'AM=M-1', // SP--
          'D=M', // D=y
          '@SP',
          'AM=M-1', // SP--
          oper, // x = x oper y
          '@SP',
          'M=M+1' // SP++
        ]);
        break;
      case 'eq':
        oper = oper || 'D;JEQ';
      case 'gt':
        oper = oper || 'D;JGT';
      case 'lt':
        oper = oper || 'D;JLT';
        code = code.concat([
          // stack: x, y  : result x==y ? -1 : 0
          // SP--, D=*SP, SP--, if (*SP oper D) *SP=-1(true) else *SP=0(false); SP++
          '@SP',
          'AM=M-1', // SP--
          'D=M', // D=*SP (y)
          '@SP',
          'AM=M-1', // SP--
          'D=M-D', // D=x-y
          `@IF_${this.labelnum}`,
          oper,
          '@SP', // if x oper y === false
          'A=M',
          'M=0', // result false
          `@ENDIF_${this.labelnum}`,
          '0;JMP',
          `(IF_${this.labelnum})`, //if x oper y === true
          '@SP',
          'A=M',
          'M=-1', // result true
          `(ENDIF_${this.labelnum})`,
          '@SP',
          'M=M+1' // SP++
        ]);
        break;

      // unary
      case 'neg':
        oper = oper || 'M=-M';
      case 'not':
        oper = oper || 'M=!M';
        code = code.concat([
          // stack x : result -x
          // SP--, *SP=(oper)*SP, SP++
          '@SP',
          'AM=M-1',
          oper,
          '@SP',
          'M=M+1'
        ]);
        break;
      default:
    }
    this.lines = this.lines.concat(code);
    this.labelnum++;
  }

  /** write the assembly code that is the translation of the given command, where the
   *  command is either C_PUSH or C_POP
   *  memory segments: argument, local, static, constant, this, that, pointer, temp
   */
  writePushPop(command /*C_PUSH or C_POP*/, segment, index) {
    index = Number(index);
    let code = [`// ${command} ${segment} ${index}`]; // start with comment
    let register;
    switch (segment) {
      case 'argument':
        register = 'ARG';
        break;
      case 'local':
        register = 'LCL';
        break;
      case 'static':
        break;
      case 'constant':
        break;
      case 'this':
        register = 'THIS';
        break;
      case 'that':
        register = 'THAT';
        break;
      case 'pointer':
        register = index === 0 ? 'THIS' : 'THAT';
        break;
      case 'temp':
        register = `R${5 + index}`;
        break;
      default:
    }

    if (command === Parser.ct.C_PUSH) {
      if (segment === 'constant') {
        // for e.g., push constant 6
        code = code.concat([
          `@${index}`,
          'D=A', // D=index
          '@SP',
          'A=M',
          'M=D', // *SP=index
          '@SP',
          'M=M+1' // SP++
        ]);
      } else if (segment === 'argument' || segment === 'local' || segment === 'this' || segment === 'that') {
        // for e.g., push argument 6
        code = code.concat([
          `@${index}`,
          'D=A', // D = index
          `@${register}`,
          'A=D+M', // pointer arithmetic - index + base address
          'D=M', // D = *(segment+offset)
          '@SP',
          'A=M',
          'M=D', // push D to stack
          '@SP',
          'M=M+1' // SP++
        ]);
      } else if (segment === 'pointer' || segment === 'temp') {
        // for e.g., push pointer 0 or push temp 6
        // pointer 0 refers to THIS, pointer 1 refers to THAT
        code = code.concat([
          `@${register}`,
          'D=M', // D=THIS or THAT
          '@SP',
          'A=M',
          'M=D', // *SP=D
          '@SP',
          'M=M+1'
        ]); // SP++
      } else if (segment === 'static') {
        // for e.g., push static 6, should generate @foo.6, where foo.vm is the file being processed
        code = code.concat([
          `@${this.staticLabel}.${index}`, // use assembler's automatic address allocation R(16 + i++)
          'D=M', // D=value to push
          '@SP',
          'A=M',
          'M=D', // *SP=value
          '@SP',
          'M=M+1' // SP++
        ]);
      }
    } else if (command === Parser.ct.C_POP) {
      if (segment === 'argument' || segment === 'local' || segment === 'this' || segment === 'that') {
        // for e.g., pop argument 6
        code = code.concat([
          `@${index}`,
          'D=A', // D = index
          `@${register}`,
          'D=D+M', // D = index + base address
          '@R13',
          'M=D', // R13=address to store value
          '@SP',
          'AM=M-1',
          'D=M', // D = popped value
          '@R13',
          'A=M', // move to destination address
          'M=D' // store popped value in destination
        ]);
      } else if (segment === 'pointer' || segment === 'temp') {
        // for e.g., pop pointer 0 or pop temp 7,
        // store popped value into THIS(0) or THAT(1) or R(5+7)
        code = code.concat([
          '@SP',
          'AM=M-1', // pop
          'D=M', // D = popped value
          `@${register}`,
          'M=D'
        ]); // store popped value at the destination
      } else if (segment === 'static') {
        // for e.g., pop static 6, should store popped value into @foo.6, where foo.vm is the file being processed
        code = code.concat([
          '@SP',
          'AM=M-1', // pop
          'D=M', // D = popped value
          `@${this.staticLabel}.${index}`,
          'M=D'
        ]); // store popped value at the destination
      }
    }
    this.lines = this.lines.concat(code);
  }

  /**
   * closes the output file
   */
  close() {
    // save assembly to output
    fs.writeFileSync(this.outputFile, this.lines.join('\n'));
  }
}

module.exports = CodeWriter;
