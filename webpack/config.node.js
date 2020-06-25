const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
    target: 'node',
    output: {
        filename: 'index.node.js',
        libraryTarget: 'commonjs2'
    }
});
