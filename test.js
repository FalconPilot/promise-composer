const PCO = require('./index.js')

/*
**  PCO.isset
**
**  Expected behavior : Promise should
*/

const ASSERTION_FALSE = "ASSERTION_FALSE"

function genPromise(value) {
  return new Promise((resolve, reject) => resolve(value))
}

function test(func, value, assertion = value) {
  genPromise(value)
    .then(func)
    .then(val => handleResponse(func, val, assertion))
    .catch(err => handleResponse(func, err, assertion))
}

function handleResponse(func, value, assertion) {
  const result = value === assertion ? "OK" : "KO :("
  const ast = typeof value === "string" ? `"${assertion}"` : assertion
  const val = typeof value === "string" ? `"${value}"` : value
  console.log(`--> [${result}] Testing PCO.${func.name}`)
  console.log(`|___ Expecting ${ast}`)
  console.log(`|___ Obtained  ${val}\n`)
}

console.log("\n--- Starting tests... ---\n")

// Unit tests
const tests = [

  // PCO.isset
  test(PCO.isset, undefined, ASSERTION_FALSE),
  test(PCO.isset, "Value"),
  test(PCO.isset, null),

  // PCO.exists
  test(PCO.exists, null, ASSERTION_FALSE),
  test(PCO.exists, undefined, ASSERTION_FALSE),
  test(PCO.exists, "", ""),

  // PCO.fullString
  test(PCO.fullString, " ", ASSERTION_FALSE),
  test(PCO.fullString, "Coucou")

]
