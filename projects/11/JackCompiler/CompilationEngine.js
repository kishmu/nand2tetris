#!/usr/bin/env node
const fs = require('fs');
const { JackTokenizer, TOKENTYPE, OPS, UNARYOPS, KWCONSTS } = require('./JackTokenizer');
const { SymbolTable, VAR_KIND, SUBR_KIND } = require('./SymbolTable');
const { VMWriter, VM_SEGMENT, VM_UNARY_ARITHMETIC, VM_ARITHMETIC, VM_ARITHMETIC_FUNC } = require('./VMWriter');

/** map from symbol table to VM segment */
const SYM_2_VMSEGMENT = {
  [VAR_KIND.STATIC]: VM_SEGMENT.STATIC,
  [VAR_KIND.FIELD]: VM_SEGMENT.THIS,
  [VAR_KIND.ARG]: VM_SEGMENT.ARG,
  [VAR_KIND.VAR]: VM_SEGMENT.LOCAL
};

/** Recursive top-down parser */
class CompilationEngine {
  constructor(input, output) {
    this.className = '';

    // Stack for counting # expressions in expression list
    // for e.g., MyClass.someFunc(point.xyz(a, b), x, y);
    // has nested expression list, so we use a stack
    this.nArgs = [];

    // for generating unique labels
    this.labelCount = 0;

    this.nLocals = 0;

    this.vmWriter = new VMWriter(output);
    this.symbolTable = new SymbolTable();
    this.tokenizer = new JackTokenizer(input);
    this.tokenizer.advance();

    this.compileClass();

    this.vmWriter.close();
  }

  compileClass() {
    /*
      class: 'class' className '(' classVarDec* subroutineDec* '}'
    */
    this.eatKeyword('class');
    this.className = this.eatIdentifier();
    this.eatSymbol('{');

    // class variable declarations
    let keyword;
    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === VAR_KIND.FIELD || keyword === VAR_KIND.STATIC)
    ) {
      this.compileClassVarDec();
    }

    // subroutines - constructor, methods and functions
    while (
      this.tokenizer.tokenType() === TOKENTYPE.KEYWORD &&
      ((keyword = this.tokenizer.keyWord()) === SUBR_KIND.CONSTR ||
        keyword === SUBR_KIND.FUNC ||
        keyword === SUBR_KIND.METHOD)
    ) {
      this.compileSubroutine();
    }

    this.eatSymbol('}');
  }

  compileClassVarDec() {
    /*
      classVarDec: ('static' | 'field') type varName(',' varName)* ';'
      type: 'int' | 'char' | 'boolean' | className
      className: identifier
    */

    // static / field
    const varKind = this.eatKeyword();

    // type
    let varType;
    if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      varType = this.eatKeyword(['int', 'char', 'boolean']);
    } else {
      // className type
      varType = this.eatIdentifier();
    }

    // varName(',' varName)*
    while (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, varKind);

      if (this.tokenizer.tokenType() === TOKENTYPE.SYMBOL && this.tokenizer.symbol() === ';') {
        break;
      }
      this.eatSymbol(',');
    }

    // ;
    this.eatSymbol(';');
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

    this.symbolTable.startSubroutine();

    // constructor / function / method
    const funcType = this.eatKeyword();
    if (funcType === SUBR_KIND.METHOD) {
      this.symbolTable.define('this', this.className, VAR_KIND.ARG);
    }

    // return type
    if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      this.eatKeyword(['void', 'int', 'char', 'boolean']);
    } else {
      // className type
      this.eatIdentifier();
    }

    const subroutineName = this.eatIdentifier();

    this.eatSymbol('(');

    this.compileParameterList();

    this.eatSymbol(')');

    // subroutineBody
    this.eatSymbol('{');

    // varDec
    while (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD && this.tokenizer.keyWord() === 'var') {
      this.compileVarDec();
    }

    this.vmWriter.writeFunction(`${this.className}.${subroutineName}`, this.symbolTable.varCount(VAR_KIND.VAR));

    if (funcType === SUBR_KIND.METHOD) {
      // anchor 'this' = argument 0
      this.vmWriter.writePush(VM_SEGMENT.ARG, 0);
      this.vmWriter.writePop(VM_SEGMENT.POINTER, 0);
    } else if (funcType === SUBR_KIND.CONSTR) {
      // allocate memory and anchor 'this'
      const memSize = this.symbolTable.varCount(VAR_KIND.FIELD);
      this.vmWriter.writePush(VM_SEGMENT.CONST, memSize);
      this.vmWriter.writeCall(`Memory.alloc`, 1);
      this.vmWriter.writePop(VM_SEGMENT.POINTER, 0);
    }

    this.compileStatements();

    this.eatSymbol('}');
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

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ')') {
      let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
      if (varType) {
        varType = this.eatKeyword(['int', 'char', 'boolean']);
      } else {
        // className type
        varType = this.eatIdentifier();
      }

      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, VAR_KIND.ARG);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
      }
    }
  }

  compileVarDec() {
    /*
      varDec: 'var' type varName(',' varName)* ';'
    */

    this.eatKeyword('var');

    // type
    let varType = this.tokenizer.tokenType() === TOKENTYPE.KEYWORD;
    if (varType) {
      varType = this.eatKeyword(['int', 'char', 'boolean']);
    } else {
      // className type
      varType = this.eatIdentifier();
    }

    // type varName, type varName ...
    while (this.tokenizer.currentToken !== ';') {
      // varName
      const varName = this.eatIdentifier();
      this.symbolTable.define(varName, varType, VAR_KIND.VAR);

      if (this.tokenizer.currentToken === ',') {
        this.eatSymbol(',');
      }
    }

    this.eatSymbol(';');
  }

  compileStatements() {
    /*
      statements: statement*
      statement: letStatement | ifStatement | whileStatement | doStatement | returnStatement
    */

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
  }

  compileDo() {
    /*
      doStatement: 'do' subroutineCall ';'
      subroutineCall: subroutineName '(' expressionList ')' | (className|varName) '.' subroutineName '(' expressionList ')'
    */

    this.eatKeyword('do');

    // subroutineName or (className|varName)
    let subrName = this.eatIdentifier();

    this.compileCall(subrName);

    this.eatSymbol(';');

    this.vmWriter.writePop(VM_SEGMENT.TEMP, 0); // discard the return from 'do' as returns a void
  }

  /**
   * it is called in two places - do someFunc() and in an expression like let x = someFunc()
   * @param {string} classOrVar - this is the first identifier 'x' in x.someFunc()
   */
  compileCall(classOrVar) {
    let subroutineName = null;
    if (this.tokenizer.currentToken === '(') {
      this.eatSymbol('(');
    } else if (this.tokenizer.currentToken === '.') {
      this.eatSymbol('.');

      subroutineName = this.eatIdentifier();

      this.eatSymbol('(');
    }

    this.compileExpressionList();

    this.eatSymbol(')');

    // TO DO: this could be simplified
    // Functions can be of types -
    // Class.StaticFunction() - Static functions (including OS functions)
    // this.method(), method() - these are identical. Calling some method of this class
    // square.move() - calling some method of the square variable
    const FUNC_TYPE = { STATIC: 0, THIS_METHOD: 1, VAR_METHOD: 2 };
    let funcType = null;

    if (classOrVar === 'this') {
      funcType = FUNC_TYPE.THIS_METHOD;
      classOrVar = this.className;
    } else if (!subroutineName) {
      funcType = FUNC_TYPE.THIS_METHOD;
      subroutineName = classOrVar;
      classOrVar = this.className;
    } else if (this.symbolTable.kindOf(classOrVar) === VAR_KIND.NONE) {
      funcType = FUNC_TYPE.STATIC;
    } else {
      funcType = FUNC_TYPE.VAR_METHOD;
    }

    if (funcType === FUNC_TYPE.THIS_METHOD) {
      // set `this` = base address of this instance
      this.vmWriter.writePush(VM_SEGMENT.POINTER, 0);
      this.nArgs[this.nArgs.length - 1]++;
    } else if (funcType === FUNC_TYPE.VAR_METHOD) {
      // set `this` = baseAddress of var
      this.vmWriter.writePush(
        SYM_2_VMSEGMENT[this.symbolTable.kindOf(classOrVar)],
        this.symbolTable.indexOf(classOrVar)
      );
      this.nArgs[this.nArgs.length - 1]++;

      classOrVar = this.symbolTable.typeOf(classOrVar);
    }

    const functionName = `${classOrVar}.${subroutineName}`;
    this.vmWriter.writeCall(functionName, this.nArgs.pop());
  }

  compileLet() {
    /*
      letStatement: 'let' varName('[' expression ']')? '=' expression ';'
    */

    this.eatKeyword('let');

    const varName = this.eatIdentifier();

    let isArray = false;
    if (this.tokenizer.currentToken === '[') {
      isArray = true;
      // let a[i] = b[j]
      // push a
      // push i
      // add
      // push b
      // push j
      // add
      // pop pointer 1
      // push that 0
      // pop temp 0 <== at this point stack's top = address of a[i] and temp[0] = b[j]
      // pop pointer 1
      // push temp 0
      // pop that 0
      this.eatSymbol('[');

      this.compileExpression();

      this.eatSymbol(']');

      this.vmWriter.writePush(SYM_2_VMSEGMENT[this.symbolTable.kindOf(varName)], this.symbolTable.indexOf(varName));
      this.vmWriter.writeArithmetic(VM_ARITHMETIC.ADD);
    }

    this.eatSymbol('=');

    this.compileExpression();

    this.eatSymbol(';');
    if (isArray) {
      this.vmWriter.writePop(VM_SEGMENT.TEMP, 0);
      this.vmWriter.writePop(VM_SEGMENT.POINTER, 1);
      this.vmWriter.writePush(VM_SEGMENT.TEMP, 0);
      this.vmWriter.writePop(VM_SEGMENT.THAT, 0);
    } else {
      this.vmWriter.writePop(SYM_2_VMSEGMENT[this.symbolTable.kindOf(varName)], this.symbolTable.indexOf(varName));
    }
  }

  compileWhile() {
    /*
			whileStatement: 'while' '(' expression ')' '{' statements '}' 
    */

    /**
     * while (expression) statements ...
     * label LOOP
     * compiled (expression)
     * not
     * if-goto END_LOOP
     * compiled (statements)
     * goto LOOP
     * label END_LOOP
     */
    this.eatKeyword('while');

    this.eatSymbol('(');

    const startLoopLabel = `LOOP_${this.labelCount++}`;
    this.vmWriter.writeLabel(startLoopLabel);

    this.compileExpression();

    this.eatSymbol(')');

    this.vmWriter.writeArithmetic(VM_UNARY_ARITHMETIC.NOT);
    const endLoopLabel = `END_LOOP_${this.labelCount++}`;
    this.vmWriter.writeIf(endLoopLabel);

    this.eatSymbol('{');

    this.compileStatements();

    this.eatSymbol('}');

    this.vmWriter.writeGoto(startLoopLabel);
    this.vmWriter.writeLabel(endLoopLabel);
  }

  compileReturn() {
    /*
      returnStatement: 'return' expression? ';'
    */
    this.eatKeyword('return');

    if (this.tokenizer.currentToken !== ';') {
      this.compileExpression();
    } else {
      this.vmWriter.writePush(VM_SEGMENT.CONST, 0);
    }

    this.eatSymbol(';');
    this.vmWriter.writeReturn();
  }

  compileIf() {
    /*
      ifStatement: 'if' '(' expression ')' '{' statements '}'
                    ('else' '{' statements '}')?
    */

    /** 
     * src if (expresssion) (statements1 else (statement2)
     * vm code :
     * -------
     * compiled (expression)
       not
       if-goto ELSE
       compiled (statements1)
       goto END_IF
       label ELSE
       compiled (statements2)
      label END_IF
     */

    this.eatKeyword('if');

    this.eatSymbol('(');

    this.compileExpression();

    this.eatSymbol(')');

    this.vmWriter.writeArithmetic(VM_UNARY_ARITHMETIC.NOT);

    const elseLabel = `ELSE_${this.labelCount++}`;
    this.vmWriter.writeIf(elseLabel);

    this.eatSymbol('{');

    this.compileStatements();

    this.eatSymbol('}');

    const endIfLabel = `END_IF_${this.labelCount++}`;
    this.vmWriter.writeGoto(endIfLabel);

    this.vmWriter.writeLabel(elseLabel);

    if (this.tokenizer.currentToken === 'else') {
      this.eatKeyword('else');

      this.eatSymbol('{');

      this.compileStatements();

      this.eatSymbol('}');
    }

    this.vmWriter.writeLabel(endIfLabel);
  }

  compileExpression() {
    /*
      expression: term (op term)*
    */

    this.compileTerm();

    while (OPS.has(this.tokenizer.currentToken)) {
      const op = this.eatSymbol();
      this.compileTerm();
      if (op in VM_ARITHMETIC_FUNC) {
        // for e.g., * translates to Math.multiply with 2 args
        this.vmWriter.writeCall(VM_ARITHMETIC_FUNC[op], 2);
      } else {
        this.vmWriter.writeArithmetic(VM_ARITHMETIC[op]);
      }
    }
  }

  compileTerm() {
    /*
      term: integerConstant | stringConstant | keywordConstant |
            varName | varName '[' expression ']' | subroutineCall |
            '(' expression ')' | unaryOp term
    */

    if (this.tokenizer.tokenType() === TOKENTYPE.INT_CONST) {
      const ic = this.eatIntConstant();
      this.vmWriter.writePush(VM_SEGMENT.CONST, ic);
    } else if (this.tokenizer.tokenType() === TOKENTYPE.STRING_CONST) {
      const sc = this.eatStringConstant();
      this.vmWriter.writePush(VM_SEGMENT.CONST, sc.length);
      this.vmWriter.writeCall('String.new', 1);
      for (let i = 0; i < sc.length; ++i) {
        this.vmWriter.writePush(VM_SEGMENT.CONST, sc.charCodeAt(i));
        this.vmWriter.writeCall('String.appendChar', 2);
      }
    } else if (this.tokenizer.tokenType() === TOKENTYPE.KEYWORD) {
      const kwc = this.eatKeywordConstant();
      if (kwc === 'true') {
        // -1
        this.vmWriter.writePush(VM_SEGMENT.CONST, 1);
        this.vmWriter.writeArithmetic(VM_UNARY_ARITHMETIC.NEG);
      } else if (kwc === 'false' || kwc === 'null') {
        this.vmWriter.writePush(VM_SEGMENT.CONST, 0);
      } else if (kwc === 'this') {
        this.vmWriter.writePush(VM_SEGMENT.POINTER, 0);
      }
    } else if (UNARYOPS.has(this.tokenizer.currentToken)) {
      // unaryOp term
      const sym = this.eatSymbol();
      this.compileTerm();
      this.vmWriter.writeArithmetic(VM_UNARY_ARITHMETIC[sym]);
    } else if (this.tokenizer.currentToken === '(') {
      // '(' expression ')'
      this.eatSymbol('(');
      this.compileExpression();
      this.eatSymbol(')');
    } else if (this.tokenizer.tokenType() === TOKENTYPE.IDENTIFIER) {
      // varName | varName '[' expression ']' | subroutineCall |
      let varName = this.eatIdentifier();

      if (this.tokenizer.currentToken === '[') {
        // varname '[' expression ']'

        // b[j]
        // push b
        // push j
        // add
        // pop pointer 1
        // push that 0
        this.eatSymbol('[');

        this.compileExpression();

        this.eatSymbol(']');

        this.vmWriter.writePush(SYM_2_VMSEGMENT[this.symbolTable.kindOf(varName)], this.symbolTable.indexOf(varName));
        this.vmWriter.writeArithmetic(VM_ARITHMETIC.ADD);
        this.vmWriter.writePop(VM_SEGMENT.POINTER, 1);
        this.vmWriter.writePush(VM_SEGMENT.THAT, 0);
      } else if (this.tokenizer.currentToken === '(' || this.tokenizer.currentToken === '.') {
        // subroutineCall
        this.compileCall(varName);
      } else {
        // varName
        this.vmWriter.writePush(SYM_2_VMSEGMENT[this.symbolTable.kindOf(varName)], this.symbolTable.indexOf(varName));
      }
    }
  }

  compileExpressionList() {
    /*
      expressionList: (expression(',' expression)*)?
    */

    this.nArgs.push(0);

    if (this.tokenizer.currentToken !== ')') {
      this.compileExpression();
      this.nArgs[this.nArgs.length - 1]++;

      while (this.tokenizer.currentToken === ',') {
        const sym = this.eatSymbol(',');
        this.compileExpression();
        this.nArgs[this.nArgs.length - 1]++;
      }
    }
  }

  mustMatch(expected, str) {
    if (!expected) return;
    const isMatch = Array.isArray(expected) ? expected.indexOf(str) !== -1 : expected === str;
    if (!isMatch) {
      throw new Error(`Expected ${expected}, got ${str} instead`);
    }
  }

  // *******
  // eatXXX function consumes the token of type xxx and advances to the next token
  // It throws an error if the token does not match expected
  // *******
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

module.exports = { CompilationEngine };
