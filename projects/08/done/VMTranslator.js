const fs = require('fs');
const Parser = require('./Parser');
const CodeWriter = require('./CodeWriter');
const path = require('path');

const usage = () => {
  console.log(`VMTranslator - translates vm code into hack machine assembly code
    usage: node VMTranslator.js foo.vm
    foo.vm - input file containing vm code. Must have extension .vm
    The output will be <input file directory>/foo.asm
    `);
};

// validate input to program
if (process.argv.length < 3) {
  console.log('error: bad usage');
  usage();
  process.exit(1);
}

const inputFile = path.resolve(__dirname, process.argv[2]);
const vmFiles = [];
let outputFile;

// If the program’s argument is a directory name rather than a file name, the main program should process all the .vm files in this directory.
// In doing so, it should use a separate Parser for handling each input file and a single CodeWriter for handling the output
let addInitCode = false;
if (fs.statSync(inputFile).isDirectory()) {
  outputFile = `${path.basename(inputFile)}.asm`;
  outputFile = path.join(inputFile, outputFile);
  fs.readdirSync(inputFile).forEach((file) => {
    if (/\.vm$/.test(file)) {
      vmFiles.push(path.join(inputFile, file));
      addInitCode = addInitCode || /^Sys\.vm$/i.test(file);
    }
  });
} else if (/\.vm$/.test(inputFile)) {
  outputFile = outputFile || inputFile.replace(/\.vm$/, '.asm');
  vmFiles.push(inputFile);
  addInitCode = addInitCode || /^Sys\.vm$/i.test(inputFile);
}

const codeWriter = new CodeWriter(outputFile);
if (addInitCode) {
  codeWriter.writeInit();
}

vmFiles.forEach((file) => {
  const parser = new Parser(file);
  codeWriter.setFileName(file);
  while (parser.hasMoreCommands()) {
    parser.advance();
    switch (parser.commandType()) {
      case Parser.ct.C_ARITHMETIC:
        codeWriter.writeArithmetic(parser.currentCommand[0]);
        break;
      case Parser.ct.C_PUSH:
      case Parser.ct.C_POP:
        codeWriter.writePushPop(parser.commandType(), parser.arg1(), parser.arg2());
        break;
      case Parser.ct.C_LABEL:
        codeWriter.writeLabel(parser.arg1());
        break;
      case Parser.ct.C_GOTO:
        codeWriter.writeGoto(parser.arg1());
        break;
      case Parser.ct.C_IF:
        codeWriter.writeIf(parser.arg1());
        break;
      case Parser.ct.C_FUNCTION:
        codeWriter.writeFunction(parser.arg1(), parser.arg2());
        break;
      case Parser.ct.C_CALL:
        codeWriter.writeCall(parser.arg1(), parser.arg2());
        break;
      case Parser.ct.C_RETURN:
        codeWriter.writeReturn();
        break;
      default:
        break;
    }
  }
});

// write to output
codeWriter.close();
