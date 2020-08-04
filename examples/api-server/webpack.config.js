const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: { server: './bin/www.js' },
    mode: 'production',
    target: 'node',
    node: {
        fs: 'empty'
    },
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false, // if you don't put this is, __dirname
        __filename: false // and __filename return blank or /
    },
    externals: [nodeExternals()],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    }
};
