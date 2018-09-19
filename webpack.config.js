const path = require('path');

module.exports = {
  mode: "production",
  entry: "./src/promise-composer.js",
  output: {
    filename: "promise-composer-build.js",
    path: path.resolve(__dirname, 'lib')
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: { presets: ['@babel/env'] }
    }]
  }
};
