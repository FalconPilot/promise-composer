const tests = require('./tests.js')
const H = require('./helpers.js')

// Aliases
const NC  = H.colors.NC
const GRE = H.colors.GRE
const MAG = H.colors.MAG

/*
**  Play unit tests
*/

const timestamp = new Date().getTime()
H.renderSeparator(`Starting tests, timestamp ${NC}${timestamp}${MAG}`, '')

// Notify if tests are run in mute mode
if (process.argv.includes("--mute")) {
  console.log(`/!\\ ${GRE}Tests are run in mute mode ${NC}[--mute]${GRE}, so only failed tests will appear below.\n${NC}`)
}

// Unit tests
Promise.all(tests).then(H.generateReport).catch(console.log)
