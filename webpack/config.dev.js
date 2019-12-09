const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
});
