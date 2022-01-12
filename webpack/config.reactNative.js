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
        filename: 'index.reactNative.js',
        libraryTarget: 'umd'
    },
    externals: [
        nodeExternals({
            allowlist: ['axios', 'validate.js']
        })
    ]
});
