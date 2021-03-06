"use strict";

/*
**  Promise Composer Object class
*/

class PCO {

  /*
  **  Class constants
  */

  // Regular constants
  static get ASSERTION_FALSE() { return "PCO_ASSERTION_FALSE" }

  /*
  **  Common functions
  */

  // Local assertion handling function
  static result(value, assertion) {
    return assertion ? Promise.resolve(value) : Promise.reject(PCO.ASSERTION_FALSE)
  }

  // Muted assertion handling function (doesn't reject, only resolve)
  static mutedResult(value, assertion) {
    return assertion ? Promise.resolve(value) : Promise.resolve(PCO.ASSERTION_FALSE)
  }

  // Local method to return assertion result instead of promise
  static pure(x, assertion) { return assertion }

  // Allow custom assertions to be created
  static assert(x, assertFunc, func = PCO.result) {
    return func(x, assertFunc(x))
  }

  /*
  **  Functions to allow more complex conditional composition using Arrays
  */

  // General multiple assertion helper
  static multiAssert(x, assertions, verif) {
    return Promise.all(assertions.map(a => a(x, PCO.mutedResult)))
      .then(raw => {
        const values = raw.filter(v => v !== PCO.ASSERTION_FALSE)

        // Throw a .catch() clause if the verification function is false
        if (verif(raw, values)) {
          return x
        } else {
          throw PCO.ASSERTION_FALSE
        }
      })
  }

  // Continue if all conditions are true
  static all(x, assertions) {
    return PCO.multiAssert(x, assertions, (r, v) => v.length === r.length)
  }

  // Continue if one condition at least is true
  static any(x, assertions) {
    return PCO.multiAssert(x, assertions, (r, v) => v.length > 0 || r.length === 0)
  }

  // Traverse array of values to confirm assertions to them
  static traverse(values, assertion) {
    return Promise.all(values.map(x => assertion(x, PCO.mutedResult)))
      .then(raw => {
        const values = raw.filter(v => v !== PCO.ASSERTION_FALSE)

        // Throw a .catch() clause if not all values are validated
        if (values.length === raw.length) {
          return values
        } else {
          throw PCO.ASSERTION_FALSE
        }
      })
  }

  /*
  **  Assertion functions, exposed and usable
  **  by the end-user
  */

  // Assert element is not undefined
  static isset(x, func = PCO.result) {
    return func(x, typeof x !== "undefined")
  }

  // Assert element is neither undefined or null
  static exists(x, func = PCO.result) {
    return func(x, PCO.isset(x, PCO.pure)
      && x !== null
    )
  }

  // Assert element is a non-empty string
  static fullString(x, func = PCO.result) {
    return func(x, typeof x === "string"
      && x.trim() !== ""
    )
  }

  // Assert element is valid non-array object
  static isObject(x, func = PCO.result) {
    return func(x, typeof x === "object"
      && !Array.isArray(x)
    )
  }

  // Assert element is valid array
  static isArray(x, func = PCO.result) {
    return func(x, Array.isArray(x))
  }

  // Assert element is a valid number
  static isNumber(x, func = PCO.result) {
    return func(x, typeof x === "number")
  }

  // Assert element is an Integer
  static isInteger(x, func = PCO.result) {
    return func(x, Number.isInteger(x))
  }

}

module.exports = PCO
