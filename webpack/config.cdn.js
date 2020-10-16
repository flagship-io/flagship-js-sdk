// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'web',
    entry: {
        app: './src/standAlone.ts'
    },
    output: {
        filename: 'flagship.bundle.js',
        library: 'flagship',
        libraryExport: 'default'
    },
    mode: 'production',
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.(ts|js)x?$/,
                enforce: 'pre',
                include: path.resolve(__dirname),
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
    plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    }
};
