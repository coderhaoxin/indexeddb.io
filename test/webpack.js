'use strict'

module.exports = {
  entry: 'mocha!./test/index.js',

  output: {
    path: __dirname,
    filename: 'test.build.js',
    publicPath: 'http://localhost:3000/test'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  }
}
