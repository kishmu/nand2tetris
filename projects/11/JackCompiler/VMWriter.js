const fs = require('fs');

const VM_SEGMENT = {
  CONST: 'constant',
  ARG: 'argument',
  LOCAL: 'local',
  STATIC: 'static',
  THIS: 'this',
  THAT: 'that',
  POINTER: 'pointer',
  TEMP: 'temp'
};

const VM_ARITHMETIC = {
  '+': 'add',
  '-': 'sub',
  '&': 'and',
  '|': 'or',
  '<': 'lt',
  '>': 'gt',
  '=': 'eq'
};

const VM_UNARY_ARITHMETIC = {
  '-': 'neg',
  '~': 'not'
};

const VM_ARITHMETIC_FUNC = {
  '*': 'Math.multiply',
  '/': 'Math.divide'
};

class VMWriter {
  constructor(output) {
    // create a new file and prepare it for writing
    this.output = output;
    this.vmcode = [];
  }

  /**
   * Writes a VM push command
   * @param {string} segment - CONST, ARG, LOCAL, STATIC, THIS, THAT, POINTER, TEMP
   * @param {number} index
   */
  writePush(segment, index) {
    this.vmcode.push(`push ${segment} ${index}`);
  }

  /**
   * Writes a VM pop command
   * @param {string} segment - CONST, ARG, LOCAL, STATIC, THIS, THAT, POINTER, TEMP
   * @param {number} index
   */
  writePop(segment, index) {
    this.vmcode.push(`pop ${segment} ${index}`);
  }

  /**
   * Writes a VM arithmetic command
   * @param {string} command - ADD, SUB, NEG, EQ, GT, LT, AND, OR, NOT
   */
  writeArithmetic(command) {
    this.vmcode.push(command);
  }

  /**
   * Writes a VM label command
   * @param {string} label
   */
  writeLabel(label) {
    this.vmcode.push(`label ${label}`);
  }

  /**
   * Writes a VM goto command
   * @param {string} label
   */
  writeGoto(label) {
    this.vmcode.push(`goto ${label}`);
  }

  /**
   * Writes a VM if-goto command
   * @param {string} label
   */
  writeIf(label) {
    this.vmcode.push(`if-goto ${label}`);
  }

  /**
   * Writes a VM call command
   * @param {string} name
   * @param {number} nArgs
   */
  writeCall(name, nArgs) {
    this.vmcode.push(`call ${name} ${nArgs}`);
  }

  /**
   * Writes a VM function command
   * @param {string} name
   * @param {number} nLocals
   */
  writeFunction(name, nLocals) {
    this.vmcode.push(`function ${name} ${nLocals}`);
  }

  /**
   * Writes a VM return command
   */
  writeReturn() {
    this.vmcode.push(`return`);
  }

  /**
   * Closes the output file
   */
  close() {
    fs.writeFileSync(this.output, this.vmcode.join('\n'));
  }
}

module.exports = { VMWriter, VM_SEGMENT, VM_ARITHMETIC, VM_ARITHMETIC_FUNC, VM_UNARY_ARITHMETIC };
