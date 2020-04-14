const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
  target: 'web',
  output: {
    filename: 'index.browser.js',
    libraryTarget: 'umd',
  },
});
