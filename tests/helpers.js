const PCO = require('../src/promise-composer.js')

/*
**  Test helpers
*/

// Generate shell color code
function color(code) {
  return process.argv.includes("--plain") ? "" : "\033[" + code + "m"
}

// Shell colors
const RED = color(31)
const GRE = color(32)
const YEL = color(33)
const MAG = color(35)
const NC  = color(0)

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
  return test(func, value, assertion, [value].concat(args))
}

// Function response handler
function handleResponse(func, input, value, assertion, resolve) {

  const check = (value === PCO.ASSERTION_FALSE && assertion === PCO.ASSERTION_FALSE)
    || (value !== PCO.ASSERTION_FALSE && assertion !== PCO.ASSERTION_FALSE)

  // Format string elements
  const funcName = func.name !== undefined ? func.name : "(lambda)"
  const result = check ? `${GRE}OK${NC}` : `${RED}KO${NC}`
  const color = check ? GRE : RED
  const prefix = PCO.hasOwnProperty(funcName) ? `${YEL}PCO${NC}.` : ""

  if (!process.argv.includes("--mute") || !check) {
    // Log results
    console.log(`--> [${result}] Testing ${prefix}${funcName} using ${wrap(input)}`)
    console.log(`|___ Expecting ${wrap(assertion)}`)
    console.log(`|___ Obtained  ${wrap(value)}\n`)
  }

  // Resolve parent promise with function/score values
  resolve({
    score: check ? 1 : 0,
    func: `${prefix}${funcName}`
  })
}

// Generate tests report
function generateReport(values) {

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
}

module.exports = {
  test: test,
  testArray: testArray,
  renderSeparator: renderSeparator,
  generateReport: generateReport,
  colors: {
    RED: RED,
    GRE: GRE,
    YEL: YEL,
    MAG: MAG,
    NC:  NC
  }
}
