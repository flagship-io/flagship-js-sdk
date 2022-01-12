const { merge } = require('webpack-merge');
const baseConfig = require('./config.base.js');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(baseConfig, {
    target: 'web',
    resolve: {
        alias: {
            http: false,
            https: false
        }
    },
    output: {
        filename: 'index.browser.js',
        libraryTarget: 'umd'
    },
    externals: [
        nodeExternals({
            importType: 'umd',
            allowlist: ['axios', 'validate.js', 'events', '@flagship.io/js-sdk-logs']
        })
    ]
});
