const merge = require('webpack-merge');
const devConfig = require('./config.dev.js');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = merge(devConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
