#!/usr/bin/env node
const Parser = require('./Parser');
const Code = require('./Code');
const SymbolTable = require('./SymbolTable');
let file = process.argv[2];
const fs = require('fs');

if (!file) {
  console.log('no file specified');
  process.exit(1);
}

if (!/\.asm$/.test(file)) {
  console.log('unknown file extension');
  process.exit(1);
}

let firstPass = (lines) => {
  // (forward) look labels
  let labelsFound = 0;
  lines.forEach((line, i) => {
    if (line[0] === '(') {
      let symbol = line.substr(1, line.length - 2);
      SymbolTable.addLabel(symbol, i - labelsFound++);
    }
  });
};

let secondPass = (lines) => {
  // process user variables and produce binary code, ignore lines with labels
  let output = '';
  lines.forEach((line) => {
    if (line[0] === '(') {
      // skip labels
    } else if (line[0] === '@' && isNaN(Number(line.substr(1)))) {
      // is a user variable
      // Add the variable to the symbol table and convert the return value into code
      output += `${Code.getCode(`@${SymbolTable.addVariable(line.substr(1))}`)}\n`;
    } else {
      output += `${Code.getCode(line)}\n`;
    }
  });
  // save output
  fs.writeFileSync(file.replace(/\.asm$/i, '.hack'), output);
};

let lines = new Parser(file).lines;
firstPass(lines);
secondPass(lines);
