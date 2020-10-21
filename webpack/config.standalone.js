const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');
const path = require('path');

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: false,
    target: 'web',
    output: {
        filename: 'index.standalone.js',
        path: path.resolve(__dirname, '../public'),
        library: 'Flagship', // TBC - CAP on Flagship
        libraryTarget: 'umd'
    }
});
