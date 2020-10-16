// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        app: './src/index.ts'
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
        library: 'flagship',
        libraryExport: 'default'
    },
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.(ts|js)x?$/,
                enforce: 'pre',
                include: path.resolve(__dirname), // <-- This tell to eslint to look only in your project folder
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            cache: true,
                            failOnError: true,
                            failOnWarning: false
                        }
                    }
                ]
            },
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry'
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    externals: [
        nodeExternals({
            whitelist: ['axios', 'validate.js']
        })
    ],
    plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    }
};
