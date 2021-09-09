const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = merge(baseConfig, {
    target: 'web',
    output: {
        filename: 'index.browser.js',
        libraryTarget: 'umd'
    },
    plugins: [new NodePolyfillPlugin()]
});
