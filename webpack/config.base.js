// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'flagship',
    libraryExport: 'default',
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              // eslint options (if necessary)
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              // eslint options (if necessary)
            },
          },
        ],
      },
    ],
  },
  externals: [
    nodeExternals({
      whitelist: ['axios', 'validate.js'],
    }),
  ],
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
};
