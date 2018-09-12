/*
**  Promise Composer Object class
*/

class PCO {

  // Local assertion handling function
  static assert(value, assertion) {
    return new Promise((resolve, reject) => {
      if (assertion) { resolve(value) } else { reject("ASSERTION_FALSE") }
    })
  }

  // Local method to simply return assertion, used for internal functionality
  static cond(x, assertion) { return assertion }

  /*
  **  Assertion functions, exposed and usable
  **  by the end-user
  */

  // Assert element is not undefined
  static isset(x, func = PCO.assert) {
    return func(x, typeof x !== "undefined")
  }

  // Assert element is neither undefined or null
  static exists(x, func = PCO.assert) {
    return func(x, PCO.isset(x, PCO.cond)
      && x !== null
    )
  }

  // Assert element is a non-empty string
  static fullString(x, func = PCO.assert) {
    return func(x, PCO.exists(x, PCO.cond)
      && typeof x === "string"
      && x.trim() !== ""
    )
  }

}

// Node.js module exports
module.exports = PCO
