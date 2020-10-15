const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
    target: 'web',
    output: {
        filename: 'index.cdn.js',
        libraryTarget: 'umd'
    },
    externals: []
});
