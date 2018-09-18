const PCO = require('../lib/promise-composer.js')

/*
**  PCO unit tests
*/

// Important constants
const ASSERTION_FALSE = "ASSERTION_FALSE"

// Shell colors
const RED = "\033[31m"
const GRE = "\033[32m"
const YEL = "\033[33m"
const NC  = "\033[0m"

// Test helper
function test(func, value, assertion = value) {
  Promise.resolve(value)
    .then(func)
    .then(resp => handleResponse(func, value, resp, assertion))
    .catch(err => handleResponse(func, value, err, assertion))
}

// Function response handler
function handleResponse(func, input, value, assertion) {

  // Define constants
  const result = value === assertion ? `${GRE}OK${NC}` : `${RED}KO${NC}`
  const ast = typeof value === "string" ? `"${assertion}"` : assertion
  const val = typeof value === "string" ? `"${value}"` : value
  const inp = typeof input === "string" ? `"${input}"` : input
  const color = value === assertion ? GRE : RED
  const prefix = PCO.hasOwnProperty(func.name) ? `${YEL}PCO${NC}.` : ""

  // Log results
  console.log(`--> [${result}] Testing ${prefix}${func.name} using ${inp}`)
  console.log(`|___ Expecting ${ast}`)
  console.log(`|___ Obtained  ${val}\n`)
}

/*
**  Play unit tests
*/

console.log("\n--- Starting tests... ---\n")

// Test custom assertion
function assertInteger(x) { return Number.isInteger(x) }
const isInteger = (x) => PCO.assert(x, assertInteger)

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
  test(PCO.fullString, null, ASSERTION_FALSE),
  test(PCO.fullString, undefined, ASSERTION_FALSE),
  test(PCO.fullString, " ", ASSERTION_FALSE),
  test(PCO.fullString, "Coucou"),
  test(isInteger, 15),
  test(isInteger, "yeah", ASSERTION_FALSE)

]
