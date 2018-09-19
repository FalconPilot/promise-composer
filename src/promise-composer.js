/*
**  Promise Composer Object class
*/

const ASSERTION_FALSE = "ASSERTION_FALSE"

class PCO {

  // Local assertion handling function
  static promise(value, assertion) {
    return assertion ? Promise.resolve(value) : Promise.reject(ASSERTION_FALSE)
  }

  // Local method to simply return assertion, used for internal functionality
  static cond(x, assertion) { return assertion }

  /*
  **  Make assertion functions customizable
  */

  static assert(x, assertion, func = PCO.promise) {
    return func(x, assertion)
  }

  /*
  **  Assertion functions, exposed and usable
  **  by the end-user
  */

  // Assert element is not undefined
  static isset(x, func = PCO.promise) {
    return func(x, typeof x !== "undefined")
  }

  // Assert element is neither undefined or null
  static exists(x, func = PCO.promise) {
    return func(x, PCO.isset(x, PCO.cond)
      && x !== null
    )
  }

  // Assert element is a non-empty string
  static fullString(x, func = PCO.promise) {
    return func(x, PCO.exists(x, PCO.cond)
      && typeof x === "string"
      && x.trim() !== ""
    )
  }

  // Assert element is valid non-array object
  static isObject(x, func = PCO.promise) {
    return func(x, typeof x === "object" && !Array.isArray(x))
  }

  // Assert element is valid array
  static isArray(x, func = PCO.promise) {
    return func(x, Array.isArray(x))
  }

  // Assert element is a valid number
  static isNumber(x, func = PCO.promise) {
    return func(x, typeof x === "number")
  }

  // Assert element is an Integer
  static isInteger(x, func = PCO.promise) {
    return func(x, Number.isInteger(x))
  }

}

module.exports = PCO
