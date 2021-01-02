const fs = require('fs');

const COMMAND = {
  C_ARITHMETIC: 0,
  C_PUSH: 1,
  C_POP: 2,
  C_LABEL: 3,
  C_GOTO: 4,
  C_IF: 5,
  C_FUNCTION: 6,
  C_RETURN: 7,
  C_CALL: 8
};

class Parser {
  constructor(vm) {

    // read input file, stripping comments and whitespaces
    this.commands = fs.readFileSync(vm, { encoding: 'utf-8' }).split('\n').filter(l => {
			// remove single line comments
			const s = l.trim();
			return s.length !== 0 && /^\/\//.test(s) === false;
		}).map(l => {
			// clean up each command line, with any trailing comments
			return l.trim().split('\/\/')[0];
		});

		// pointer to current command
		this.currPos = -1;
		this.currentCommand = [];
  }

  hasMoreCommands() {
    return this.currPos !== this.commands.length - 1;
	}

  advance() {
		this.currPos++;
		this.currentCommand = this.commands[this.currPos].split(/\s+/);
	}

  commandType() {
		switch(this.currentCommand[0]) {
			case 'push':
				return COMMAND.C_PUSH;
			case 'pop':
				return COMMAND.C_POP;
			case 'add':
			case 'sub':
			case 'neg':
			case 'eq':
			case 'gt':
			case 'lt':
			case 'and':
			case 'or':
			case 'not':
				return COMMAND.C_ARITHMETIC;
			case 'label':
				return COMMAND.C_LABEL;
			case 'goto':
				return COMMAND.C_GOTO;
			case 'if-goto':
				return COMMAND.C_IF;
			case 'function':
				return COMMAND.C_FUNCTION;
			case 'return':
				return COMMAND.C_RETURN;
			case 'call':
				return COMMAND.C_CALL;
			default:
		}
	}

  arg1() {
		const ct = this.commandType();
		if (ct === COMMAND.C_ARITHMETIC) {
			return this.currentCommand[0];
		} 
		return this.currentCommand[1];
	}

  arg2() {
		return this.currentCommand[2];
	}
}

module.exports = { Parser, COMMAND };
