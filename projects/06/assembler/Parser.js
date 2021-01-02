const fs = require('fs');

// parse input file into instructions and instruction fields
class Parser {
  constructor(file) {
    let stats = fs.statSync(file);
    if (!stats.isFile()) {
      throw new Error(`${file} is not a file`);
    }
    this.file = file;
    this.execute();
  }

  // assume no errors in the assembly file!!
  execute() {
    this.lines = fs
      .readFileSync(this.file, 'utf8')
      .split('\n')
      .reduce((acc, line) => {
        // remove whitepaces and comments
        line = line.split('//')[0].trim();
        if (line.length === 0) {
          return acc;
        }

        if (line[0] !== '@' && line[0] !== '(') {
          // C instruction
          let dest,
            comp,
            jump,
            temp = '';
          for (let i = 0; i < line.length; ++i) {
            if (line[i] === '=') {
              dest = temp;
              temp = '';
            } else if (line[i] === ';') {
              comp = temp;
              temp = '';
            } else {
              temp += line[i];
            }
          }
          if (comp) {
            jump = temp;
          } else if (dest) {
            comp = temp;
          } else {
            jump = temp; // unconditional JMP
          }
          acc.push([dest, comp, jump]);
          return acc;
        }

        return acc.concat(line);
      }, []);
  }
}

module.exports = Parser;
