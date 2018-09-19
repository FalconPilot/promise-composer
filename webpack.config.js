const path = require('path');

module.exports = {
  entry: "./src/promise-composer.js",
  output: {
    filename: "promise-composer-build.js",
    path: path.resolve(__dirname, 'lib')
  }
};
