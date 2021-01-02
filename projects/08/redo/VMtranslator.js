#!/usr/bin/env node



const path = require('path');
const fs = require('fs');
const { Parser, COMMAND } = require('./Parser');
const { CodeWriter } = require('./CodeWriter');

// input 
const argv = process.argv;
if (argv.length !== 3 || argv[2] === '--help') {
	usage();
	process.exit(1);
}

function usage() {
	console.log(`
  Usage: node VMtranslator.js source_file

  Generates an hack assemly file from vm file

  source_file   It can be a file or directory. 
                If a file, it should have a .vm extension
                If a directory, it can contain one or more .vm files

  The output is a file with same name as source_file, with extension .asm
  `);
}

// input / output files
let input = process.argv[2];
let output = '';
try {
  input = path.resolve(input);
  const dirname = path.dirname(input);
  const basename = path.basename(input);

  if (fs.statSync(input).isDirectory()) {
    output = path.join(input, basename + '.asm');

    // input will be vm files in the directory
    input = fs.readdirSync(input).filter(f => path.extname(f) === '.vm').map(f => path.join(input, f));
  } else {
    const ext = path.extname(input);
    if (ext !== '.vm') {
      throw new Error('input should be a .vm file');
    }
  
    output = path.join(dirname, basename.replace(ext, '.asm'));
    input = [input]; // single file
  }
} catch (e) {
  // Bad input
  console.error(e);
  process.exit(1);
}

const cw = new CodeWriter(output);
const shouldCallInit = input.find(f => /Sys\.vm$/i.test(path.basename(f)));
if (shouldCallInit) {
  cw.writeInit(); // add bootstrap
}

input.forEach(f => {
  console.log(`parsing file: ${f}`);
  cw.setFileName(path.basename(f));
  
  const p = new Parser(f);
  while (p.hasMoreCommands()) {
    p.advance();
    switch(p.commandType()) {
      case COMMAND.C_ARITHMETIC:
        cw.writeArithmetic(p.arg1());
        break;
      case COMMAND.C_PUSH:
        cw.writePushPop(COMMAND.C_PUSH, p.arg1(), p.arg2());
        break;
      case COMMAND.C_POP:
        cw.writePushPop(COMMAND.C_POP, p.arg1(), p.arg2());
        break;
      case COMMAND.C_LABEL:
        cw.writeLabel(p.arg1());
        break;
      case COMMAND.C_GOTO:
        cw.writeGoto(p.arg1());
        break;
      case COMMAND.C_IF:
        cw.writeIf(p.arg1());
        break;
      case COMMAND.C_FUNCTION:
        cw.writeFunction(p.arg1(), p.arg2());
        break;
      case COMMAND.C_RETURN:
        cw.writeReturn();
        break;
      case COMMAND.C_CALL:
        cw.writeCall(p.arg1(), p.arg2());
        break;
      default:
    }
  }
});

cw.close();

console.log(`Done writing to ${output}`)
