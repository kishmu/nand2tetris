const fs = require('fs');

class Parser {
  /**
   * open input file stream and ready to parse it
   */
  constructor(inputFile) {
    fs.statSync(inputFile);
    this.lines = fs
      .readFileSync(inputFile, 'utf8')
      .split('\n')
      .reduce((acc, line) => {
        // skip whitespaces
        line = line.trim();
        if (line && !/^\/\//.test(line)) {
          line = line.split('//')[0].trim();
          acc.push(line);
        }
        return acc;
      }, []);

    this.pos = 0; // next line number to read
    this.currentCommand = undefined;
  }

  /**
   * are there more commands in the input
   * {return true or false}
   */
  hasMoreCommands() {
    return this.pos < this.lines.length;
  }

  /**
   * Read next command and make it current command
   * Should be called only if hasMoreCommands() is true
   * Initially there is no current command
   */
  advance() {
    this.currentCommand = this.lines[this.pos].split(' ');
    this.pos++;
  }

  /**
   * return type of current VM command
   * arithmetic & logical commands: add, sub, neg, eq, gt, lt, and, or, not
   * memory segments: argument, local, static, constant, this, that, pointer, temp
   * {return commandtype}
   */
  commandType() {
    let ct;
    switch (this.currentCommand[0]) {
      case 'add':
      case 'sub':
      case 'neg':
      case 'eq':
      case 'gt':
      case 'lt':
      case 'and':
      case 'or':
      case 'not':
        ct = Parser.ct.C_ARITHMETIC;
        break;
      case 'push':
        ct = Parser.ct.C_PUSH;
        break;
      case 'pop':
        ct = Parser.ct.C_POP;
        break;
      case 'label':
        ct = Parser.ct.C_LABEL;
        break;
      case 'goto':
        ct = Parser.ct.C_GOTO;
        break;
      case 'if-goto':
        ct = Parser.ct.C_IF;
        break;
      case 'function':
        ct = Parser.ct.C_FUNCTION;
        break;
      case 'return':
        ct = Parser.ct.C_RETURN;
        break;
      case 'call':
        ct = Parser.ct.C_CALL;
        break;
      default:
    }
    return ct;
  }

  /**
   * Return first argument of the current command
   * in the case of C_ARITHMETIC the command itself (add, sub, etc)
   * is returned
   * Should not be called if the current command is C_RETURN
   * {return string}
   */
  arg1() {
    if (this.commandType() === Parser.ct.C_ARITHMETIC) {
      return this.currentCommand[0];
    }
    return this.currentCommand[1];
  }

  /**
   * Return the second argument of the current command
   * Should be called only if the current command is C_PUSH, C_POP, C_FUNCTION, or C_CALL
   * {return int}
   */
  arg2() {
    return this.currentCommand[2];
  }
}

Parser.ct = Object.freeze({
  C_ARITHMETIC: 'arithmetic',
  C_PUSH: 'push',
  C_POP: 'pop',
  C_LABEL: 'label',
  C_GOTO: 'goto',
  C_IF: 'if',
  C_FUNCTION: 'function',
  C_RETURN: 'return',
  C_CALL: 'call'
});

module.exports = Parser;
