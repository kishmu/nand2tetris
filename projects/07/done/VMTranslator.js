const fs = require('fs');
const Parser = require('./Parser');
const CodeWriter = require('./CodeWriter');

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

const inputFile = process.argv[2];
let outputFile;
let parsers = [];
// If the program’s argument is a directory name rather than a file name, the main program should process all the .vm files in this directory.
// In doing so, it should use a separate Parser for handling each input file and a single CodeWriter for handling the output
if (fs.statSync(inputFile).isDirectory()) {
  fs.readdirSync(inputFile).forEach((file) => {
    if (/\.vm$/.test(file)) {
      parsers.push(new Parser(file));
      outputFile = outputFile || file.replace(/\.vm$/, '.asm');
    }
  });
} else {
  if (/\.vm$/.test(inputFile)) {
    parsers.push(new Parser(inputFile));
    outputFile = outputFile || inputFile.replace(/\.vm$/, '.asm');
  } else {
    throw new Error('input file is not a vm file');
  }
}

const codeWriter = new CodeWriter(outputFile);

parsers.forEach((parser) => {
  while (parser.hasMoreCommands()) {
    parser.advance();
    if (parser.commandType() === Parser.ct.C_ARITHMETIC) {
      codeWriter.writeArithmetic(parser.currentCommand[0]);
    } else if (parser.commandType() === Parser.ct.C_PUSH || parser.commandType() === Parser.ct.C_POP) {
      codeWriter.writePushPop(parser.commandType(), parser.arg1(), parser.arg2());
    }
  }
});

// write to output
codeWriter.close();
