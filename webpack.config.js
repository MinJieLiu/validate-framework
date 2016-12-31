const webpack = require('webpack');
const path = require('path');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = process.env.NODE_ENV;

const libraryName = 'Validator';
const plugins = [];
let outputFile;

// production and minimize
if (env === 'production') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = `${libraryName}.min.js`;
} else {
  outputFile = `${libraryName}.js`;
}

module.exports = {
  entry: [
    './src/index',
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
};
