#!/usr/bin/env node
const fs = require('fs');
const { JackTokenizer, TOKENTYPE, OPS, UNARYOPS, KWCONSTS, XML_RESERVED_CHAR } = require('./JackTokenizer');
const { SymbolTable, VAR_KIND, SUBR_KIND } = require('./SymbolTable');

function XML(value) {
  if (XML_RESERVED_CHAR.hasOwnProperty(value)) {
    value = XML_RESERVED_CHAR[value];
  }
  return value;
}

/** Recursive top-down parser */
class CompilationEngine {
  constructor(input, output) {
    this.tokenizer = new JackTokenizer(input);
    this.tokenizer.advance();

    this.symbolTable = new SymbolTable();

    this.isCompilingDecl = false;

    this.xmloutput = [];
    this.xmloutput.push('<class>');

    this.compileClass();

    this.xmloutput.push('</class>');

    this.saveXmlOutput(output);
  }

  saveXmlOutput(output) {
    this.formatXMLOutput();
    fs.writeFileSync(output, this.xmloutput.join('\n') + '\n');
  }

  formatXMLOutput() {
    let indent = 0;
    const twoSpaces = '  ';
    let onlyStartTag, onlyEndTag;
    this.xmloutput = this.xmloutput.map(x => {
      onlyStartTag = /^\<(?!\/)[^\>]*\>$/.test(x);
      onlyEndTag = /^\<\/[^\>]*\>$/.test(x);
      if (onlyEndTag) {
        indent--;
      }
      x = `${Array(indent).fill(twoSpaces).join('') + x}`; // indent the line
      if (onlyStartTag) {
        indent++;
      }
      return x;
    });
  }

  compileClass() {
    /*
      class: 'class' className '(' classVarDec* subroutineDec* '}'
    */
    this.eatKeyword('class');
    this.writeXML(TOKENTYPE.KEYWORD, 'class');

    this.className = this.eatIdentifier();
    this.writeXML(TOKENTYPE.IDENTIFIER, this.className);

    this.eatSymbol('{');
    this.writeXML(TOKENTYPE.SYMBOL, '{');

    let keyword;
    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === VAR_KIND.FIELD || keyword === VAR_KIND.STATIC)
    ) {
      this.compileClassVarDec();
    }

    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === SUBR_KIND.CONSTR ||
        keyword === SUBR_KIND.FUNC ||
        keyword === SUBR_KIND.METHOD)
    ) {
      this.compileSubroutine();
    }

    this.eatSymbol('}');
    this.writeXML(TOKENTYPE.SYMBOL, '}');
  }

  compileClassVarDec() {
    /*
      classVarDec: ('static' | 'field') type varName(',' varName)* ';'
      type: 'int' | 'char' | 'boolean' | className
      className: identifier
    */

    this.isCompilingDecl = true;
    this.xmloutput.push(`<classVarDec>`);
    // static / field
    const varKind = this.eatKeyword();
    this.writeXML(TOKENTYPE.KEYWORD, varKind);

    // type
    let varType;
    if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      varType = this.eatKeyword(['int', 'char', 'boolean']);
      this.writeXML(TOKENTYPE.KEYWORD, varType);
    } else {
      // className type
      varType = this.eatIdentifier();
      this.writeXML(TOKENTYPE.IDENTIFIER, varType);
    }

    // varName(',' varName)*
    while (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, varKind);

      this.writeXML(TOKENTYPE.IDENTIFIER, varName);

      if (this.tokenizer.tokenType() === TOKENTYPE.SYMBOL && this.tokenizer.symbol() === ';') {
        break;
      }
      this.eatSymbol(',');
      this.writeXML(TOKENTYPE.SYMBOL, ',');
    }

    // ;
    this.eatSymbol(';');
    this.writeXML(TOKENTYPE.SYMBOL, ';');

    this.xmloutput.push(`</classVarDec>`);
    this.isCompilingDecl = false;
  }

  compileSubroutine() {
    /*
      subroutineDec: ('constructor' | 'function' | 'method')
                     ('void' | type) subroutineName '(' parameterList ')'
                     subroutineBody
      type: 'int' | 'char' | 'boolean' | className
      subroutineName: identifier
      subroutineBody: '{' varDec* statements '}'
      varDec: 'var' type varName(',' varName)* ';'
    */

    this.xmloutput.push(`<subroutineDec>`);

    this.symbolTable.startSubroutine();

    // constructor / function / method
    const funcType = this.eatKeyword();
    if (funcType === SUBR_KIND.METHOD) {
      this.symbolTable.define('this', this.className, VAR_KIND.ARG);
    }
    this.writeXML(TOKENTYPE.KEYWORD, funcType);

    // return type
    let returnType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
    if (returnType) {
      returnType = this.eatKeyword(['void', 'int', 'char', 'boolean']);
      this.writeXML(TOKENTYPE.KEYWORD, returnType);
    } else {
      // className type
      returnType = this.eatIdentifier();
      this.writeXML(TOKENTYPE.IDENTIFIER, returnType);
    }

    const subroutineName = this.eatIdentifier();
    this.writeXML(TOKENTYPE.IDENTIFIER, subroutineName);

    this.eatSymbol('(');
    this.writeXML(TOKENTYPE.SYMBOL, '(');

    this.compileParameterList();

    this.eatSymbol(')');
    this.writeXML(TOKENTYPE.SYMBOL, ')');

    this.xmloutput.push(`<subroutineBody>`);

    // subroutineBody
    this.eatSymbol('{');
    this.writeXML(TOKENTYPE.SYMBOL, '{');

    // varDec
    while (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD && this.tokenizer.keyWord() === 'var') {
      this.compileVarDec();
    }

    this.compileStatements();

    this.eatSymbol('}');
    this.writeXML(TOKENTYPE.SYMBOL, '}');

    this.xmloutput.push(`</subroutineBody>`);

    this.xmloutput.push(`</subroutineDec>`);
  }

  compileParameterList() {
    /*
      ? : 0 or 1 time
      * : 0 or more times
      
      parameterList: ((type varName)(',' type varName))?
      type: 'int' | 'char' | 'boolean' | className
      className: identifier
      varName: identifier
    */

    this.isCompilingDecl = true;
    this.xmloutput.push(`<parameterList>`);

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ')') {
      let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
      if (varType) {
        varType = this.eatKeyword(['int', 'char', 'boolean']);
        this.writeXML(TOKENTYPE.KEYWORD, varType);
      } else {
        // className type
        varType = this.eatIdentifier();
        this.writeXML(TOKENTYPE.IDENTIFIER, varType);
      }

      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, VAR_KIND.ARG);

      this.writeXML(TOKENTYPE.IDENTIFIER, varName);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
        this.writeXML(TOKENTYPE.SYMBOL, ',');
      }
    }

    this.xmloutput.push(`</parameterList>`);
    this.isCompilingDecl = false;
  }

  compileVarDec() {
    /*
      varDec: 'var' type varName(',' varName)* ';'
    */

    this.isCompilingDecl = true;
    this.xmloutput.push(`<varDec>`);

    this.eatKeyword('var');
    this.writeXML(TOKENTYPE.KEYWORD, 'var');

    // type
    let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
    if (varType) {
      varType = this.eatKeyword(['int', 'char', 'boolean']);
      this.writeXML(TOKENTYPE.KEYWORD, varType);
    } else {
      // className type
      varType = this.eatIdentifier();
      this.writeXML(TOKENTYPE.IDENTIFIER, varType);
    }

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ';') {
      // varName
      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, VAR_KIND.VAR);
      this.writeXML(TOKENTYPE.IDENTIFIER, varName);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
        this.writeXML(TOKENTYPE.SYMBOL, ',');
      }
    }

    this.eatSymbol(';');
    this.writeXML(TOKENTYPE.SYMBOL, ';');

    this.xmloutput.push(`</varDec>`);
    this.isCompilingDecl = false;
  }

  compileStatements() {
    /*
      statements: statement*
      statement: letStatement | ifStatement | whileStatement | doStatement | returnStatement
    */

    this.xmloutput.push(`<statements>`);

    while (this.tokenizer.currentToken !== '}') {
      const kw = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD && this.tokenizer.keyWord();
      if (kw === 'let') {
        this.compileLet();
      } else if (kw === 'if') {
        this.compileIf();
      } else if (kw === 'while') {
        this.compileWhile();
      } else if (kw === 'do') {
        this.compileDo();
      } else if (kw === 'return') {
        this.compileReturn();
      } else {
        throw new Error(`Unknown statement keyword ${kw}`);
      }
    }

    this.xmloutput.push(`</statements>`);
  }

  compileDo() {
    /*
      doStatement: 'do' subroutineCall ';'
      subroutineCall: subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'
    */

    this.xmloutput.push(`<doStatement>`);

    this.eatKeyword('do');
    this.writeXML(TOKENTYPE.KEYWORD, 'do');

    // subroutineName or (className|varName)
    const name = this.eatIdentifier();
    this.writeXML(TOKENTYPE.IDENTIFIER, name);

    if (this.tokenizer.currentToken === '(') {
      this.eatSymbol('(');
      this.writeXML(TOKENTYPE.SYMBOL, '(');
    } else if (this.tokenizer.currentToken === '.') {
      this.eatSymbol('.');
      this.writeXML(TOKENTYPE.SYMBOL, '.');
      const sn = this.eatIdentifier();
      this.writeXML(TOKENTYPE.IDENTIFIER, sn);
      this.eatSymbol('(');
      this.writeXML(TOKENTYPE.SYMBOL, '(');
    }

    this.compileExpressionList();

    this.eatSymbol(')');
    this.writeXML(TOKENTYPE.SYMBOL, ')');

    this.eatSymbol(';');
    this.writeXML(TOKENTYPE.SYMBOL, ';');

    this.xmloutput.push(`</doStatement>`);
  }

  compileLet() {
    /*
      letStatement: 'let' varName('[' expression ']')? '=' expression ';'
    */
    this.xmloutput.push(`<letStatement>`);

    this.eatKeyword('let');
    this.writeXML(TOKENTYPE.KEYWORD, 'let');

    const varName = this.eatIdentifier();
    this.writeXML(TOKENTYPE.IDENTIFIER, varName);

    if (this.tokenizer.currentToken === '[') {
      this.eatSymbol('[');
      this.writeXML(TOKENTYPE.SYMBOL, '[');

      this.compileExpression();

      this.eatSymbol(']');
      this.writeXML(TOKENTYPE.SYMBOL, ']');
    }

    this.eatSymbol('=');
    this.writeXML(TOKENTYPE.SYMBOL, '=');

    this.compileExpression();

    this.eatSymbol(';');
    this.writeXML(TOKENTYPE.SYMBOL, ';');

    this.xmloutput.push(`</letStatement>`);
  }

  compileWhile() {
    /*
			whileStatement: 'while' '(' expression ')' '{' statements '}' 
    */
    this.xmloutput.push(`<whileStatement>`);

    this.eatKeyword('while');
    this.writeXML(TOKENTYPE.KEYWORD, 'while');

    this.eatSymbol('(');
    this.writeXML(TOKENTYPE.SYMBOL, '(');

    this.compileExpression();

    this.eatSymbol(')');
    this.writeXML(TOKENTYPE.SYMBOL, ')');

    this.eatSymbol('{');
    this.writeXML(TOKENTYPE.SYMBOL, '{');

    this.compileStatements();

    this.eatSymbol('}');
    this.writeXML(TOKENTYPE.SYMBOL, '}');

    this.xmloutput.push(`</whileStatement>`);
  }

  compileReturn() {
    /*
      returnStatement: 'return' expression? ';'
    */
    this.xmloutput.push(`<returnStatement>`);

    this.eatKeyword('return');
    this.writeXML(TOKENTYPE.KEYWORD, 'return');

    if (this.tokenizer.currentToken !== ';') {
      this.compileExpression();
    }

    this.eatSymbol(';');
    this.writeXML(TOKENTYPE.SYMBOL, ';');

    this.xmloutput.push(`</returnStatement>`);
  }

  compileIf() {
    /*
      ifStatement: 'if' '(' expression ')' '{' statements '}'
                    ('else' '{' statements '}')?
    */

    this.xmloutput.push(`<ifStatement>`);

    this.eatKeyword('if');
    this.writeXML(TOKENTYPE.KEYWORD, 'if');

    this.eatSymbol('(');
    this.writeXML(TOKENTYPE.SYMBOL, '(');

    this.compileExpression();

    this.eatSymbol(')');
    this.writeXML(TOKENTYPE.SYMBOL, ')');

    this.eatSymbol('{');
    this.writeXML(TOKENTYPE.SYMBOL, '{');

    this.compileStatements();

    this.eatSymbol('}');
    this.writeXML(TOKENTYPE.SYMBOL, '}');

    if (this.tokenizer.currentToken === 'else') {
      this.eatKeyword('else');
      this.writeXML(TOKENTYPE.KEYWORD, 'else');

      this.eatSymbol('{');
      this.writeXML(TOKENTYPE.SYMBOL, '{');

      this.compileStatements();

      this.eatSymbol('}');
      this.writeXML(TOKENTYPE.SYMBOL, '}');
    }

    this.xmloutput.push(`</ifStatement>`);
  }

  compileExpression() {
    /*
      expression: term (op term)*
    */
    this.xmloutput.push(`<expression>`);

    this.compileTerm();

    while (OPS.has(this.tokenizer.currentToken)) {
      const op = this.eatSymbol();
      this.writeXML(TOKENTYPE.SYMBOL, op);

      this.compileTerm();
    }

    this.xmloutput.push(`</expression>`);
  }

  compileTerm() {
    /*
      term: integerConstant | stringConstant | keywordConstant |
            varName | varName '[' expression ']' | subroutineCall |
            '(' expression ')' | unaryOp term
    */
    this.xmloutput.push(`<term>`);

    if (this.tokenizer.tokenType() === TOKENTYPE.INT_CONST) {
      const ic = this.eatIntConstant();
      this.writeXML(TOKENTYPE.INT_CONST, ic);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.STRING_CONST) {
      const sc = this.eatStringConstant();
      this.writeXML(TOKENTYPE.STRING_CONST, sc);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      const kwc = this.eatKeywordConstant();
      this.writeXML(TOKENTYPE.KEYWORD, kwc);
    } else if (UNARYOPS.has(this.tokenizer.currentToken)) {
      // unaryOp term
      const sym = this.eatSymbol();
      this.writeXML(TOKENTYPE.SYMBOL, sym);
      this.compileTerm();
    } else if (this.tokenizer.currentToken === '(') {
      // '(' expression ')'
      this.eatSymbol('(');
      this.writeXML(TOKENTYPE.SYMBOL, '(');

      this.compileExpression();

      this.eatSymbol(')');
      this.writeXML(TOKENTYPE.SYMBOL, ')');
    } else if (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      // varName | varName '[' expression ']' | subroutineCall |
      const varName = this.eatIdentifier();
      this.writeXML(TOKENTYPE.IDENTIFIER, varName);

      if (this.tokenizer.currentToken === '[') {
        // varname '[' expression ']'
        this.eatSymbol('[');
        this.writeXML(TOKENTYPE.SYMBOL, '[');

        this.compileExpression();

        this.eatSymbol(']');
        this.writeXML(TOKENTYPE.SYMBOL, ']');
      } else if (this.tokenizer.currentToken === '(' || this.tokenizer.currentToken === '.') {
        // subroutineCall
        if (this.tokenizer.currentToken === '(') {
          this.eatSymbol('(');
          this.writeXML(TOKENTYPE.SYMBOL, '(');
        } else if (this.tokenizer.currentToken === '.') {
          this.eatSymbol('.');
          this.writeXML(TOKENTYPE.SYMBOL, '.');
          const sn = this.eatIdentifier();
          this.writeXML(TOKENTYPE.IDENTIFIER, sn);
          this.eatSymbol('(');
          this.writeXML(TOKENTYPE.SYMBOL, '(');
        }

        this.compileExpressionList();

        this.eatSymbol(')');
        this.writeXML(TOKENTYPE.SYMBOL, ')');
      }
    }

    this.xmloutput.push(`</term>`);
  }

  compileExpressionList() {
    /*
      expressionList: (expression(',' expression)*)?
    */

    this.xmloutput.push(`<expressionList>`);
    if (this.tokenizer.currentToken !== ')') {
      this.compileExpression();

      while (this.tokenizer.currentToken === ',') {
        const sym = this.eatSymbol(',');
        this.writeXML(TOKENTYPE.SYMBOL, sym);
        this.compileExpression();
      }
    }
    this.xmloutput.push(`</expressionList>`);
  }

  mustMatch(expected, str) {
    if (!expected) return;
    const isMatch = Array.isArray(expected) ? expected.indexOf(str) !== -1 : expected === str;
    if (!isMatch) {
      throw new Error(`Expected ${expected}, got ${str} instead`);
    }
  }

  eatKeyword(expected) {
    if (this.tokenizer.tokenType() !== TOKENTYPE.KEYWORD) {
      throw new Error(`Expected a keyword`);
    }
    const kw = this.tokenizer.keyWord();
    this.mustMatch(expected, kw);
    this.tokenizer.advance();
    return kw;
  }

  eatSymbol(expected) {
    if (this.tokenizer.tokenType() !== TOKENTYPE.SYMBOL) {
      throw new Error(`Expected a symbol`);
    }
    const sym = this.tokenizer.symbol();
    this.mustMatch(expected, sym);
    this.tokenizer.advance();
    return XML(sym);
  }

  eatIdentifier() {
    if (this.tokenizer.tokenType() !== TOKENTYPE.IDENTIFIER) {
      throw new Error(`Expected an identifier`);
    }
    const identifier = this.tokenizer.identifier();
    this.tokenizer.advance();
    return identifier;
  }

  eatIntConstant() {
    if (this.tokenizer.tokenType() !== TOKENTYPE.INT_CONST) {
      throw new Error(`Expected an int constant`);
    }
    const val = this.tokenizer.intVal();
    this.tokenizer.advance();
    return val;
  }

  eatStringConstant() {
    if (this.tokenizer.tokenType() !== TOKENTYPE.STRING_CONST) {
      throw new Error(`Expected an string constant`);
    }
    const val = this.tokenizer.stringVal();
    this.tokenizer.advance();
    return val;
  }

  eatKeywordConstant() {
    if (this.tokenizer.tokenType() !== TOKENTYPE.KEYWORD || !KWCONSTS.has(this.tokenizer.keyWord())) {
      throw new Error(`Expected a keyword constant`);
    }
    const val = this.tokenizer.keyWord();
    this.tokenizer.advance();
    return val;
  }

  // XML helper
  writeXML(tt, value) {
    let tokenClassification;
    let props = null;

    if (tt === TOKENTYPE.KEYWORD) {
      tokenClassification = 'keyword';
    } else if (tt === TOKENTYPE.SYMBOL) {
      tokenClassification = 'symbol';
    } else if (tt === TOKENTYPE.IDENTIFIER) {
      tokenClassification = 'identifier';
      if (this.symbolTable.kindOf(value) !== VAR_KIND.NONE) {
        props = {
          type: this.symbolTable.typeOf(value),
          kind: this.symbolTable.kindOf(value),
          index: this.symbolTable.indexOf(value),
          isDecl: this.isCompilingDecl
        };
      } else {
        props = {
          kind: 'classOrSubroutine'
        };
      }
    } else if (tt === TOKENTYPE.INT_CONST) {
      tokenClassification = 'integerConstant';
    } else if (tt === TOKENTYPE.STRING_CONST) {
      tokenClassification = 'stringConstant';
    }

    if (props) {
      let xmlProps = '';
      xmlProps += 'type' in props ? `type="${props.type}" ` : '';
      xmlProps += 'kind' in props ? `kind="${props.kind}" ` : '';
      xmlProps += 'index' in props ? `index="${props.index}" ` : '';
      xmlProps += 'isDecl' in props ? `${props.isDecl ? 'isDecl="1"' : 'isUsed="1"'}` : '';
      xmlProps = xmlProps.trim();
      this.xmloutput.push(`<${tokenClassification} ${xmlProps}> ${value} </${tokenClassification}>`);
    } else {
      this.xmloutput.push(`<${tokenClassification}> ${value} </${tokenClassification}>`);
    }
  }
}

module.exports = { CompilationEngine };
