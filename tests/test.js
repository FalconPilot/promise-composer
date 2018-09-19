const PCO = require('../src/promise-composer.js')

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
  return new Promise((resolve, reject) => {
    Promise.resolve(value)
      .then(func)
      .then(resp => handleResponse(func, value, resp, assertion, resolve, reject))
      .catch(err => handleResponse(func, value, err, assertion, resolve, reject))
      .catch(console.log)
  }).catch(console.log)
}

// Function response handler
function handleResponse(func, input, value, assertion, resolve) {

  // Define constants
  const funcName = func.name !== undefined ? func.name : "(lambda)"
  const result = value === assertion ? `${GRE}OK${NC}` : `${RED}KO${NC}`
  const ast = typeof value === "string" ? `"${assertion}"` : assertion
  const val = typeof value === "string" ? `"${value}"` : value
  const inp = typeof input === "string" ? `"${input}"` : input
  const color = value === assertion ? GRE : RED
  const prefix = PCO.hasOwnProperty(funcName) ? `${YEL}PCO${NC}.` : ""

  // Log results
  console.log(`--> [${result}] Testing ${prefix}${funcName} using ${inp}`)
  console.log(`|___ Expecting ${ast}`)
  console.log(`|___ Obtained  ${val}\n`)

  resolve({
    score: value === assertion ? 1 : 0,
    func: funcName
  })
}

/*
**  Play unit tests
*/

console.log(`${YEL}--- Starting tests... ---${NC}\n`)

// Test custom assertion
const customAssert = (x) => PCO.assert(x, Number.isInteger)


// Unit tests
Promise.all([

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
  test(customAssert, 15),
  test(customAssert, "yeah", ASSERTION_FALSE)

]).then(values => {

  // Compute score
  const score = values.reduce((t, x) => (t + x.score), 0)
  const color = score > 0
    ? ( score < values.length
      ? YEL
      : GRE
    )
    : RED
  const faulty = values.filter(x => x.score === 0)
    .map(x => x.func)
    .filter((x, pos, arr) => arr.indexOf(x) === pos)
    .map(x => `${RED}X${NC} ${x}`)

  // Log final report
  console.log("Tests done !")
  console.log(`Final score : ${color}${score}/${values.length}${NC}`)
  faulty.forEach(x => console.log(x))
}).catch(console.log)
