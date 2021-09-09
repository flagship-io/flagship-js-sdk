const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
    target: 'node',
    output: {
        filename: 'index.node.js',
        libraryTarget: 'commonjs2'
    },
    externals: [
        nodeExternals({
            whitelist: ['axios', 'validate.js', 'http', 'https']
        })
    ]
});
