const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    target: 'web',
    output: {
        filename: 'index.standalone.js',
        library: 'Flagship', // TBC - CAP on Flagship
        libraryTarget: 'umd'
    }
});
