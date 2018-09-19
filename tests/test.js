const PCO = require('../src/promise-composer.js')

/*
**  PCO unit tests
*/

// Shell colors
const RED = "\033[31m"
const GRE = "\033[32m"
const YEL = "\033[33m"
const MAG = "\033[35m"
const NC  = "\033[0m"

// Render separator
function renderSeparator(text, pre = '\n') {
  console.log(`${pre}${MAG}--- ${text} ---${NC}\n`)
}

// Wrap variable
function wrap(value) {
  return Array.isArray(value)
    ? `[${value}]`
    : {
        "object": `{${value}}`,
        "string": `"${value}"`
      }[typeof value]
}

// Simple test helper
function test(func, value, assertion = value, args = [value]) {
  return new Promise((resolve, reject) => {
    Promise.resolve(value)
      .then(x => func.apply(null, args))
      .then(resp => handleResponse(func, value, resp, assertion, resolve))
      .catch(resp => handleResponse(func, value, resp, assertion, resolve))
  }).catch(console.log)
}

// Test array functions
function testArray(func, args, value, assertion = value) {
  return test(func, value, assertion, [value].concat([args]))
}

// Function response handler
function handleResponse(func, input, value, assertion, resolve) {

  // Format string elements
  const funcName = func.name !== undefined ? func.name : "(lambda)"
  const result = value === assertion ? `${GRE}OK${NC}` : `${RED}KO${NC}`
  const color = value === assertion ? GRE : RED
  const prefix = PCO.hasOwnProperty(funcName) ? `${YEL}PCO${NC}.` : ""

  if (!process.argv.includes("--mute") || value !== assertion) {
    // Log results
    console.log(`--> [${result}] Testing ${prefix}${funcName} using ${wrap(input)}`)
    console.log(`|___ Expecting ${wrap(assertion)}`)
    console.log(`|___ Obtained  ${wrap(value)}\n`)
  }

  // Resolve parent promise with function/score values
  resolve({
    score: value === assertion ? 1 : 0,
    func: `${prefix}${funcName}`
  })
}

/*
**  Play unit tests
*/

const timestamp = new Date().getTime()
renderSeparator(`Starting tests, timestamp ${NC}${timestamp}${MAG}`, '')

if (process.argv.includes("--mute")) {
  console.log(`/!\\ ${GRE}Tests are run in mute mode ${NC}[--mute]${GRE}, so only failed tests will appear below.\n${NC}`)
}

// Test custom assertion
const customAssert = (x) => PCO.assert(x, (arr) => Array.isArray(arr) && arr.length > 3)

// Unit tests
Promise.all([

  // PCO.isset
  test(PCO.isset, undefined, PCO.ASSERTION_FALSE),
  test(PCO.isset, "Value"),
  test(PCO.isset, null),

  // PCO.exists
  test(PCO.exists, null, PCO.ASSERTION_FALSE),
  test(PCO.exists, undefined, PCO.ASSERTION_FALSE),
  test(PCO.exists, "", ""),

  // PCO.fullString
  test(PCO.fullString, null, PCO.ASSERTION_FALSE),
  test(PCO.fullString, undefined, PCO.ASSERTION_FALSE),
  test(PCO.fullString, " ", PCO.ASSERTION_FALSE),
  test(PCO.fullString, "Coucou"),

  // PCO.assert
  test(customAssert, [1, 2, 3, 4]),
  test(customAssert, [1, 2, 3], PCO.ASSERTION_FALSE),
  test(customAssert, "yeah", PCO.ASSERTION_FALSE),

  // PCO.any
  testArray(PCO.any, [PCO.fullString, PCO.isInteger], "test"),
  testArray(PCO.any, [PCO.fullString, PCO.isInteger], 15.5, PCO.ASSERTION_FALSE),
  testArray(PCO.any, [PCO.fullString, PCO.exists], ""),

  // PCO.all
  testArray(PCO.all, [PCO.fullString, PCO.exists], "", PCO.ASSERTION_FALSE)

]).then(values => {

  // Compute score and color
  const score = values.reduce((t, x) => (t + x.score), 0)
  const color = score > 0
    ? ( score < values.length
      ? YEL
      : GRE
    ) : RED

  // Define faulty functions to display
  const faulty = values.filter(x => x.score === 0)
    .map(x => x.func)
    .filter((x, pos, arr) => arr.indexOf(x) === pos)
    .map(x => `${RED}X${NC} ${x}`)

  // Log final score/fault report
  renderSeparator("Tests completed !", '')
  console.log(`Final score : ${color}${score}/${values.length}${NC}`)
  if (faulty.length > 0) { renderSeparator("Faulty functions list") }
  faulty.forEach(x => console.log(x))

}).catch(console.log)
