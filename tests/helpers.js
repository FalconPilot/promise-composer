const PCO = require('../src/promise-composer.js')
const badge = require('gh-badges')
const fs = require('fs')
const svg2img = require('svg2img')

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

  // Return object to pass informations
  return {
    score: score,
    total: values.length
  }
}

// Generate badges
function generateBadges(data) {

  // Colors and conditions
  const colors = [{
    label: "GREEN",
    color: "#97CA00",
    cond: (t, s) => s === t
  }, {
    label: "RED",
    color: "#e05d44",
    cond: (t, s) => s === 0
  }, {
    label: "YELLOW",
    color: "#dfb317",
    cond: (t, s) => s < t
  }, {
    label: "DEFAULT",
    color: "#999",
    cond: () => true
  }]

  // Configure badge
  badge({
    text: [ 'Tests coverage', ` ${data.score}/${data.total} ` ],
    format: 'svg',
    template: 'plastic',
    colorA: "#333",
    colorB: colors.filter(c => c.cond(data.total, data.score))[0].color

  // Save badge to .png
  }, (svg, err) => {
    svg2img(svg, (err, buf) => { fs.writeFileSync('badges/tests.png', buf) })
  })
}

// Exports
module.exports = {
  test: test,
  testArray: testArray,
  renderSeparator: renderSeparator,
  generateReport: generateReport,
  generateBadges: generateBadges,
  colors: {
    RED: RED,
    GRE: GRE,
    YEL: YEL,
    MAG: MAG,
    NC:  NC
  }
}
