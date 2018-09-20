const PCO = require('../src/promise-composer.js')
const H = require('./helpers.js')

// Custom test assertion
const customAssert = (x) => PCO.assert(x, (arr) => Array.isArray(arr) && arr.length > 3)

// Export unit tests
module.exports = [

  // PCO.isset
  H.test(PCO.isset, undefined, PCO.ASSERTION_FALSE),
  H.test(PCO.isset, "Value"),
  H.test(PCO.isset, null),

  // PCO.exists
  H.test(PCO.exists, null, PCO.ASSERTION_FALSE),
  H.test(PCO.exists, undefined, PCO.ASSERTION_FALSE),
  H.test(PCO.exists, "", ""),

  // PCO.fullString
  H.test(PCO.fullString, null, PCO.ASSERTION_FALSE),
  H.test(PCO.fullString, undefined, PCO.ASSERTION_FALSE),
  H.test(PCO.fullString, " ", PCO.ASSERTION_FALSE),
  H.test(PCO.fullString, "Coucou"),
  H.test(PCO.fullString, 12, PCO.ASSERTION_FALSE),

  // PCO.isNumber
  H.test(PCO.isNumber, 1),
  H.test(PCO.isNumber, 1.5),
  H.test(PCO.isNumber, null, PCO.ASSERTION_FALSE),
  H.test(PCO.isNumber, "155", PCO.ASSERTION_FALSE),

  // PCO.isInteger
  H.test(PCO.isInteger, 1),
  H.test(PCO.isInteger, 1.5, PCO.ASSERTION_FALSE),
  H.test(PCO.isInteger, "42", PCO.ASSERTION_FALSE),
  H.test(PCO.isInteger, null, PCO.ASSERTION_FALSE),

  // PCO.isObject
  H.test(PCO.isObject, {}),
  H.test(PCO.isObject, [], PCO.ASSERTION_FALSE),
  H.test(PCO.isObject, {test: "blah"}),

  // PCO.isArray
  H.test(PCO.isArray, []),
  H.test(PCO.isArray, {}, PCO.ASSERTION_FALSE),

  // PCO.assert
  H.test(customAssert, [1, 2, 3, 4]),
  H.test(customAssert, [1, 2, 3], PCO.ASSERTION_FALSE),
  H.test(customAssert, "yeah", PCO.ASSERTION_FALSE),

  // PCO.any
  H.testArray(PCO.any, [[PCO.fullString, PCO.isInteger]], "test"),
  H.testArray(PCO.any, [[PCO.fullString, PCO.isInteger]], 15.5, PCO.ASSERTION_FALSE),
  H.testArray(PCO.any, [[PCO.fullString, PCO.exists]], ""),
  H.testArray(PCO.any, [[]], "test"),

  // PCO.all
  H.testArray(PCO.all, [[PCO.fullString, PCO.exists]], "", PCO.ASSERTION_FALSE),
  H.testArray(PCO.all, [[]], "test"),

  // PCO.traverse
  H.testArray(PCO.traverse, [PCO.fullString], ["test", "blah"]),
  H.testArray(PCO.traverse, [], ["test1", "test2"]),
  H.testArray(PCO.traverse, [PCO.isInteger], [1, 2, 3.5], PCO.ASSERTION_FALSE)

]
