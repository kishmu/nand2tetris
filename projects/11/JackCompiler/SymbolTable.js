/**
 * maintains class and subroutine level sym table. For e.g.,
 *
 * Class level:
 * 	Name      |    Type   |  Kind     | # |
 * ----------------------------------------
 *   id       |    int    |  field    | 0 |
 *   owner    |    string |  field    | 1 |
 *   nAcc     |    int    |  static   | 0 |
 *
 * Subroutine level:
 *  Name      |    Type   |  Kind     | # |
 * ----------------------------------------
 *   this     | BankAcc   | argument  | 0 |
 *   sum      |    int    | argument  | 1 |
 *    i       |    int    |  var      | 0 |
 *    j       |    int    |  var      | 1 |
 * @class
 */

// SUBR_KIND is not stored in the symbol table
const SUBR_KIND = {
  CONSTR: 'constructor',
  FUNC: 'function',
  METHOD: 'method'
};

const VAR_KIND = {
  STATIC: 'static',
  FIELD: 'field',
  ARG: 'argument',
  VAR: 'var',
  NONE: -1
};

class SymbolTable {
  constructor() {
    this.classLevel = {};
    this.classLevelCount = {
      [VAR_KIND.STATIC]: 0,
      [VAR_KIND.FIELD]: 0
    };
  }

  /**
   * Starts a new subroutine scope (i.e., resets subroutine symbol table)
   */
  startSubroutine() {
    this.subroutineLevel = {};
    this.subroutineLevelCount = {
      [VAR_KIND.ARG]: 0,
      [VAR_KIND.VAR]: 0
    };
  }

  /**
   * Defines a new identifier of a given name, type and kind and assigns it a running index
   * STATIC and FIELD identifiers have a class scope, while ARG and VAR identifiers have a
   * subroutine scope
   * @param {string} name
   * @param {string} type
   * @param {} kind - STATIC, FIELD, ARG, or VAR
   */
  define(name, type, kind) {
    if (kind === VAR_KIND.FIELD || kind === VAR_KIND.STATIC) {
      this.classLevel[name] = { name, type, kind, '#': this.varCount(kind) };
      this.classLevelCount[kind]++;
    } else if (kind === VAR_KIND.VAR || kind === VAR_KIND.ARG) {
      this.subroutineLevel[name] = { name, type, kind, '#': this.varCount(kind) };
      this.subroutineLevelCount[kind]++;
    }
  }

  /**
   * Returns the number of variables of a given kind already defined in the current scope
   * @param {*} kind - STATIC, FIELD, ARG or VAR
   * @returns {int}
   */
  varCount(kind) {
    if (kind === VAR_KIND.FIELD || kind === VAR_KIND.STATIC) {
      return this.classLevelCount[kind];
    } else if (kind === VAR_KIND.VAR || kind === VAR_KIND.ARG) {
      return this.subroutineLevelCount[kind];
    }
  }

  /**
   * Returns the kind of the named identifier in the current scope. If the identifier is unknown
   * in the current scope, returns NONE
   * @param {string} name
   * @returns {kind} - STATIC, FIELD, ARG, VAR, NONE
   */
  kindOf(name) {
    if (name in this.classLevel) {
      return this.classLevel[name][kind];
    } else if (name in this.subroutineLevel) {
      return this.subroutineLevel[name][kind];
    }
    return VAR_KIND.NONE;
  }

  /**
   * Returns the type of named identifier in the current scope
   * @param {string} name
   * @returns {type} - the type of the identifier, for e.g., int, String, Point (custom type), ...
   */
  typeOf(name) {
    if (name in this.classLevel) {
      return this.classLevel[name][type];
    } else if (name in this.subroutineLevel) {
      return this.subroutineLevel[name][type];
    }
  }
}

module.exports = { SymbolTable, VAR_KIND, SUBR_KIND };
