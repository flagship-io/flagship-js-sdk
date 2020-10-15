const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');

module.exports = merge(baseConfig, {
    target: 'web',
    entry: {
        app: './src/standAlone.ts'
    },
    output: {
        filename: 'flagship.bundle.js',
        library: 'flagship',
        libraryExport: 'default'
    },
    externals: []
});
