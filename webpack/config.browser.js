const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(baseConfig, {
    target: 'web',
    output: {
        filename: 'index.browser.js',
        libraryTarget: 'umd'
    },
    externals: [
        nodeExternals({
            whitelist: ['axios', 'validate.js']
        })
    ]
});
