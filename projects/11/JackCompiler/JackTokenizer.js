#!/usr/bin/env node

const fs = require('fs');

const OPS = new Set(['+', '-', '*', '/', '&', '|', '<', '>', '=']);
const UNARYOPS = new Set(['-', '~']);
const KWCONSTS = new Set(['true', 'false', 'null', 'this']);

const LexicalElements = {
  keyword: new Set([
    'class',
    'constructor',
    'function',
    'method',
    'field',
    'static',
    'var',
    'int',
    'char',
    'boolean',
    'void',
    'true',
    'false',
    'null',
    'this',
    'let',
    'do',
    'if',
    'else',
    'while',
    'return'
  ]),
  isKeyword: function (s) {
    return this.keyword.has(s);
  },
  symbol: new Set(['{', '}', '(', ')', '[', ']', '.', ',', ';', '+', '-', '*', '/', '&', '|', '<', '>', '=', '~']),
  isSymbol: function (s) {
    return this.symbol.has(s);
  },
  isIntegerConstant: function (s) {
    return /^[0-9]+$/.test(s);
  },
  isStringConstant: function (s) {
    return /^"[^"]*"$/.test(s);
  },
  isIdentifier: function (s) {
    return /^[a-zA-Z_]\w*/.test(s);
  }
};

const TOKENTYPE = {
  KEYWORD: 0,
  SYMBOL: 1,
  IDENTIFIER: 2,
  INT_CONST: 3,
  STRING_CONST: 4
};

const XML_RESERVED_CHAR = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
};

class JackTokenizer {
  constructor(input) {
    this.input = fs.readFileSync(input, { encoding: 'utf-8' });

    // strip all comments
    const singleLineComment = /\/\/.*/;
    const multiLineComment = /\/\*([^*]|[\n\r]|\*+(?!\/))*\*+\//;
    const allComments = new RegExp(`${singleLineComment.source}|${multiLineComment.source}`, 'gm');
    this.input = this.input.replace(allComments, '').trim();

    this.length = this.input.length;
    this.pos = 0;
    this.currentToken = null;
  }

  // Do we have more tokens in the input
  hasMoreTokens() {
    return this.pos < this.length;
  }

  /**
   * Gets the next token from the input and makes it the current token.
   * This method should only be called if hasMoreTokens() is true. Initially there is no current token
   */
  advance() {
    this.currentToken = ''; // reset
    const input = this.input;

    const isWhitespaceChar = c => {
      return /\s/.test(c);
    };

    const skipWhitespaces = () => {
      while (this.pos < this.length && isWhitespaceChar(input[this.pos])) {
        this.pos++;
      }
    };

    skipWhitespaces();

    if (input[this.pos] === '"') {
      this.currentToken += input[this.pos];
      this.pos++; // start quote character
      while (this.pos < this.length && input[this.pos] !== '"') {
        this.currentToken += input[this.pos];
        this.pos++;
      }
      this.currentToken += input[this.pos];
      this.pos++; // ending quote character
    } else if (LexicalElements.isSymbol(input[this.pos])) {
      this.currentToken += input[this.pos];
      this.pos++;
    } else {
      while (this.pos < this.length && !isWhitespaceChar(input[this.pos])) {
        if (LexicalElements.isSymbol(input[this.pos])) {
          break;
        }
        this.currentToken += input[this.pos];
        this.pos++;
      }
    }

    // move to the next non-whitespace character
    skipWhitespaces();
  }

  tokenType() {
    if (LexicalElements.isKeyword(this.currentToken)) {
      return TOKENTYPE.KEYWORD;
    }
    if (LexicalElements.isSymbol(this.currentToken)) {
      return TOKENTYPE.SYMBOL;
    }
    if (LexicalElements.isIdentifier(this.currentToken)) {
      return TOKENTYPE.IDENTIFIER;
    }
    if (LexicalElements.isIntegerConstant(this.currentToken)) {
      return TOKENTYPE.INT_CONST;
    }
    if (LexicalElements.isStringConstant(this.currentToken)) {
      return TOKENTYPE.STRING_CONST;
    }
    return null;
  }

  keyWord() {
    return this.currentToken;
  }

  symbol() {
    return this.currentToken;
  }

  identifier() {
    return this.currentToken;
  }

  intVal() {
    return Number(this.currentToken);
  }

  stringVal() {
    return this.currentToken.replace(/\"/g, ''); // strip quotes
  }
}

function testTokenizer(f) {
  const tokenizer = new JackTokenizer(f);

  const output = [];
  output.push('<tokens>');
  while (tokenizer.hasMoreTokens()) {
    tokenizer.advance();
    const tt = tokenizer.tokenType();
    let tokenClassification;
    let token;
    if (tt === TOKENTYPE.KEYWORD) {
      tokenClassification = 'keyword';
      token = tokenizer.keyWord();
    } else if (tt === TOKENTYPE.SYMBOL) {
      tokenClassification = 'symbol';
      token = tokenizer.symbol();
    } else if (tt === TOKENTYPE.IDENTIFIER) {
      tokenClassification = 'identifier';
      token = tokenizer.identifier();
    } else if (tt === TOKENTYPE.INT_CONST) {
      tokenClassification = 'integerConstant';
      token = tokenizer.intVal();
    } else if (tt === TOKENTYPE.STRING_CONST) {
      tokenClassification = 'stringConstant';
      token = tokenizer.stringVal();
    }

    if (XML_RESERVED_CHAR.hasOwnProperty(token)) {
      token = XML_RESERVED_CHAR[token];
    }

    output.push(`<${tokenClassification}>${token}</${tokenClassification}>`);
  }
  output.push('</tokens>');
  return output.join('\n');
}

module.exports = { JackTokenizer, TOKENTYPE, OPS, UNARYOPS, KWCONSTS, XML_RESERVED_CHAR };
