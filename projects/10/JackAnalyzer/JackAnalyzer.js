#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { CompilationEngine } = require('./CompilationEngine');

// input and usage
const argv = process.argv;
if (argv.length !== 3 || argv[2] === '--help') {
  usage();
  process.exit(1);
}

function usage() {
  console.log(`
  Usage: node JackAnalyzer.js source_file_or_directory

	Takes one or more .jack source files as input and generates one .xml for each in the same directory. 
	The xml represents the program structure of the source conforming to the Jack grammar.

  source_file_or_directory  If a file, it should have a .jack extension
                						If a directory, it can contain one or more .jack files

	`);
}

// input
let input = process.argv[2];
try {
  input = path.resolve(input);

  if (fs.statSync(input).isDirectory()) {
    input = fs
      .readdirSync(input)
      .filter(f => path.extname(f) === '.jack')
      .map(f => path.join(input, f));
  } else {
    const ext = path.extname(input);
    if (ext !== '.jack') {
      throw new Error('input should be a .jack file');
    }
    input = [input]; // single file
  }
} catch (e) {
  // Bad input
  console.error(e);
  process.exit(1);
}

// output
const output = input.map(f => f.replace(/\.jack$/i, '.xml'));

input.forEach(f => {
  const output = f.replace(/\.jack$/i, '.xml');
  const parser = new CompilationEngine(f, output);
});
