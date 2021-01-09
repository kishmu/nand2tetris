#!/usr/bin/env node
const { JackTokenizer, TOKENTYPE, OPS, UNARYOPS, KWCONSTS, XML_RESERVED_CHAR } = require('./JackTokenizer');

function XML(value) {
  if (this.XML_RESERVED_CHAR.hasOwnProperty(value)) {
    value = XML_RESERVED_CHAR[value];
  }
  return value;
}

/** Recursive top-down parser */
class CompilationEngine {
  constructor(input, output) {
    this.tokenizer = new JackTokenizer(input);

    this.tokenizer.advance();
    this.output = [];

    this.output.push('<class>');
    this.compileClass();
    this.output.push('</class>');

    this.formatXMLOutput();

    console.log(this.output.join('\n'));
  }

  formatXMLOutput() {
    let indent = 0;
    const twoSpaces = '  ';
    let onlyStartTag, onlyEndTag;
    this.output = this.output.map(x => {
      onlyStartTag = /^\<(?!\/)[^\>]*\>$/.test(x);
      onlyEndTag = /^\<\/[^\>]*\>$/.test(x);
      if (onlyEndTag) {
        indent--;
      }
      x = `${Array(indent).fill(twoSpaces).join('') + x}`; // add indent
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
    this.output.push(`<keyword>class</keyword>`);

    const className = this.eatIdentifier();
    this.output.push(`<identifier>${className}</identifier>`);

    this.eatSymbol('{');
    this.output.push(`<symbol>{</symbol>`);

    let keyword;
    const FIELD = 'field';
    const STATIC = 'static';
    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === FIELD || keyword === STATIC)
    ) {
      this.compileClassVarDec();
    }

    const CONSTR = 'constructor';
    const FUNC = 'function';
    const METHOD = 'method';
    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === CONSTR || keyword === FUNC || keyword === METHOD)
    ) {
      this.compileSubroutine();
    }

    this.eatSymbol('}');
    this.output.push(`<symbol>}</symbol>`);
  }

  compileClassVarDec() {
    /*
      classVarDec: ('static' | 'field') type varName(',' varName)* ';'
      type: 'int' | 'char' | 'boolean' | className
      className: identifier
    */

    this.output.push(`<classVarDec>`);
    // static / field
    const staticOrField = this.eatKeyword();
    this.output.push(`<keyword>${staticOrField}</keyword>`);

    // type
    if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      const varType = this.eatKeyword(['int', 'char', 'boolean']);
      this.output.push(`<keyword>${varType}</keyword>`);
    } else {
      // className type
      const varType = this.eatIdentifier();
      this.output.push(`<identifier>${varType}</identifier>`);
    }

    // varName(',' varName)*
    while (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      const varName = this.eatIdentifier();
      this.output.push(`<identifier>${varName}</identifier>`);
      if (this.tokenizer.tokenType() === TOKENTYPE.SYMBOL && this.tokenizer.symbol() === ';') {
        break;
      }
      this.eatSymbol(',');
      this.output.push(`<symbol>,</symbol>`);
    }

    // ;
    this.eatSymbol(';');
    this.output.push(`<symbol>;</symbol>`);

    this.output.push(`</classVarDec>`);
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

    this.output.push(`<subroutineDec>`);

    // constructor / function / method
    const funcType = this.eatKeyword();
    this.output.push(`<keyword>${funcType}</keyword>`);

    // return type
    let returnType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
    if (returnType) {
      returnType = this.eatKeyword(['void', 'int', 'char', 'boolean']);
      this.output.push(`<keyword>${returnType}</keyword>`);
    } else {
      // className type
      returnType = this.eatIdentifier();
      this.output.push(`<identifier>${returnType}</identifier>`);
    }

    const subroutineName = this.eatIdentifier();
    this.output.push(`<identifier>${subroutineName}</identifier>`);

    this.eatSymbol('(');
    this.output.push(`<symbol>(</symbol>`);

    this.compileParameterList();

    this.eatSymbol(')');
    this.output.push(`<symbol>)</symbol>`);

    this.output.push(`<subroutineBody>`);

    // subroutineBody
    this.eatSymbol('{');
    this.output.push(`<symbol>{</symbol>`);

    // varDec
    while (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD && this.tokenizer.keyWord() === 'var') {
      this.compileVarDec();
    }

    this.compileStatements();

    this.eatSymbol('}');
    this.output.push(`<symbol>}</symbol>`);

    this.output.push(`</subroutineBody>`);

    this.output.push(`</subroutineDec>`);
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

    this.output.push(`<parameterList>`);

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ')') {
      let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
      if (varType) {
        varType = this.eatKeyword(['int', 'char', 'boolean']);
        this.output.push(`<keyword>${varType}</keyword>`);
      } else {
        // className type
        varType = this.eatIdentifier();
        this.output.push(`<identifier>${varType}</identifier>`);
      }

      const varName = this.eatIdentifier();
      this.output.push(`<identifier>${varName}</identifier>`);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
        this.output.push(`<symbol>,</symbol>`);
      }
    }

    this.output.push(`</parameterList>`);
  }

  compileVarDec() {
    /*
      varDec: 'var' type varName(',' varName)* ';'
    */

    this.output.push(`<varDec>`);

    this.eatKeyword('var');
    this.output.push(`<keyword>var</keyword>`);

    // type
    let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
    if (varType) {
      varType = this.eatKeyword(['int', 'char', 'boolean']);
      this.output.push(`<keyword>${varType}</keyword>`);
    } else {
      // className type
      varType = this.eatIdentifier();
      this.output.push(`<identifier>${varType}</identifier>`);
    }

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ';') {
      // varName
      const varName = this.eatIdentifier();
      this.output.push(`<identifier>${varName}</identifier>`);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
        this.output.push(`<symbol>,</symbol>`);
      }
    }

    this.eatSymbol(';');
    this.output.push(`<symbol>;</symbol>`);

    this.output.push(`</varDec>`);
  }

  compileStatements() {
    /*
      statements: statement*
      statement: letStatement | ifStatement | whileStatement | doStatement | returnStatement
    */

    this.output.push(`<statements>`);

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

    this.output.push(`</statements>`);
  }

  compileDo() {
    /*
      doStatement: 'do' subroutineCall ';'
      subroutineCall: subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'
    */

    this.output.push(`<doStatement>`);

    this.eatKeyword('do');
    this.output.push(`<keyword>do</keyword>`);

    // subroutineName or (className|varName)
    const name = this.eatIdentifier();
    this.output.push(`<identifier>${name}</identifier>`);

    if (this.tokenizer.currentToken === '(') {
      this.eatSymbol('(');
      this.output.push(`<symbol>(</symbol>`);
    } else if (this.tokenizer.currentToken === '.') {
      this.eatSymbol('.');
      this.output.push(`<symbol>.</symbol>`);
      const sn = this.eatIdentifier();
      this.output.push(`<identifier>${sn}</identifier>`);
      this.eatSymbol('(');
      this.output.push(`<symbol>(</symbol>`);
    }

    this.compileExpressionList();

    this.output.push(`<symbol>${this.eatSymbol(')')}</symbol>`);
    this.output.push(`<symbol>${this.eatSymbol(';')}</symbol>`);

    this.output.push(`</doStatement>`);
  }

  compileLet() {
    /*
      letStatement: 'let' varName('[' expression ']')? '=' expression ';'
    */
    this.output.push(`<letStatement>`);

    this.eatKeyword('let');
    this.output.push(`<keyword>let</keyword>`);

    const varName = this.eatIdentifier();
    this.output.push(`<identifier>${varName}</identifier>`);

    if (this.tokenizer.currentToken === '[') {
      this.eatSymbol('[');
      this.output.push(`<symbol>[</symbol>`);

      this.compileExpression();

      this.eatSymbol(']');
      this.output.push(`<symbol>]</symbol>`);
    }

    this.eatSymbol('=');
    this.output.push(`<symbol>=</symbol>`);

    this.compileExpression();

    this.eatSymbol(';');
    this.output.push(`<symbol>;</symbol>`);

    this.output.push(`</letStatement>`);
  }

  compileWhile() {
    /*
			whileStatement: 'while' '(' expression ')' '{' statements '}' 
    */
    this.output.push(`<whileStatement>`);

    this.eatKeyword('while');
    this.output.push(`<keyword>while</keyword>`);

    this.eatSymbol('(');
    this.output.push(`<symbol>(</symbol>`);

    this.compileExpression();

    this.eatSymbol(')');
    this.output.push(`<symbol>)</symbol>`);

    this.eatSymbol('{');
    this.output.push(`<symbol>{</symbol>`);

    this.compileStatements();

    this.eatSymbol('}');
    this.output.push(`<symbol>}</symbol>`);

    this.output.push(`</whileStatement>`);
  }

  compileReturn() {
    /*
      returnStatement: 'return' expression? ';'
    */
    this.output.push(`<returnStatement>`);

    this.eatKeyword('return');
    this.output.push(`<keyword>return</keyword>`);

    if (this.tokenizer.currentToken !== ';') {
      this.compileExpression();
    }

    this.eatSymbol(';');
    this.output.push(`<symbol>;</symbol>`);

    this.output.push(`</returnStatement>`);
  }

  compileIf() {
    /*
      ifStatement: 'if' '(' expression ')' '{' statements '}'
                    ('else' '{' statements '}')?
    */

    this.output.push(`<ifStatement>`);

    this.eatKeyword('if');
    this.output.push(`<keyword>if</keyword>`);

    this.eatSymbol('(');
    this.output.push(`<symbol>(</symbol>`);

    this.compileExpression();

    this.eatSymbol(')');
    this.output.push(`<symbol>)</symbol>`);

    this.eatSymbol('{');
    this.output.push(`<symbol>{</symbol>`);

    this.compileStatements();

    this.eatSymbol('}');
    this.output.push(`<symbol>}</symbol>`);

    if (this.tokenizer.currentToken === 'else') {
      this.eatKeyword('else');
      this.output.push(`<keyword>else</keyword>`);

      this.eatSymbol('{');
      this.output.push(`<symbol>{</symbol>`);

      this.compileStatements();

      this.eatSymbol('}');
      this.output.push(`<symbol>}</symbol>`);
    }

    this.output.push(`</ifStatement>`);
  }

  compileExpression() {
    /*
      expression: term (op term)*
    */
    this.output.push(`<expression>`);

    this.compileTerm();

    while (OPS.has(this.tokenizer.currentToken)) {
      const op = this.eatSymbol();
      this.output.push(`<symbol>${op}</symbol>`);

      this.compileTerm();
    }

    this.output.push(`</expression>`);
  }

  compileTerm() {
    /*
      term: integerConstant | stringConstant | keywordConstant |
            varName | varName '[' expression ']' | subroutineCall |
            '(' expression ')' | unaryOp term
    */
    this.output.push(`<term>`);

    if (this.tokenizer.tokenType() === TOKENTYPE.INT_CONST) {
      this.output.push(`<integerConstant>${this.eatIntConstant()}</integerConstant>`);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.STRING_CONST) {
      this.output.push(`<stringConstant>${this.eatStringConstant()}</stringConstant>`);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      this.output.push(`<keyword>${this.eatKeywordConstant()}</keyword>`);
    } else if (UNARYOPS.has(this.tokenizer.currentToken)) {
      // unaryOp term
      this.output.push(`<symbol>${this.eatSymbol()}</symbol>`);
      this.compileTerm();
    } else if (this.tokenizer.currentToken === '(') {
      // '(' expression ')'
      this.eatSymbol('(');
      this.output.push(`<symbol>(</symbol>`);

      this.compileExpression();

      this.eatSymbol(')');
      this.output.push(`<symbol>)</symbol>`);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      // varName | varName '[' expression ']' | subroutineCall |
      this.output.push(`<identifier>${this.eatIdentifier()}</identifier>`);

      if (this.tokenizer.currentToken === '[') {
        // varname '[' expression ']'
        this.eatSymbol('[');
        this.output.push(`<symbol>[</symbol>`);

        this.compileExpression();

        this.eatSymbol(']');
        this.output.push(`<symbol>]</symbol>`);
      } else if (this.tokenizer.currentToken === '(' || this.tokenizer.currentToken === '.') {
        // subroutineCall
        if (this.tokenizer.currentToken === '(') {
          this.eatSymbol('(');
          this.output.push(`<symbol>(</symbol>`);
        } else if (this.tokenizer.currentToken === '.') {
          this.eatSymbol('.');
          this.output.push(`<symbol>.</symbol>`);
          const sn = this.eatIdentifier();
          this.output.push(`<identifier>${sn}</identifier>`);
          this.eatSymbol('(');
          this.output.push(`<symbol>(</symbol>`);
        }

        this.compileExpressionList();

        this.output.push(`<symbol>${this.eatSymbol(')')}</symbol>`);
      }
    }

    this.output.push(`</term>`);
  }

  compileExpressionList() {
    /*
      expressionList: (expression(',' expression)*)?
    */

    this.output.push(`<expressionList>`);
    if (this.tokenizer.currentToken !== ')') {
      this.compileExpression();

      while (this.tokenizer.currentToken === ',') {
        const sym = this.eatSymbol(',');
        this.output.push(`<symbol>${sym}</symbol>`);
        this.compileExpression();
      }
    }
    this.output.push(`</expressionList>`);
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
    // this.eat(str);
    this.mustMatch(expected, kw);
    this.tokenizer.advance();
    return kw;
  }

  eatSymbol(expected) {
    if (this.tokenizer.tokenType() !== TOKENTYPE.SYMBOL) {
      throw new Error(`Expected a symbol`);
    }
    const sym = this.tokenizer.symbol();
    // this.eat(str);
    this.mustMatch(expected, sym);
    this.tokenizer.advance();
    return sym;
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
}

// const ce = new CompilationEngine('../ExpressionLessSquare/Main.jack');

module.exports = { CompilationEngine };
