var webpack = require('webpack');
var path = require('path');
var pkg = require(__dirname + '/package.json');

module.exports = {
    entry: path.join(__dirname, 'src/validator.js'),
    output: {
        path: __dirname + '/dev',
        filename: 'validator.js',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin(pkg.name + '\n' + pkg.version + '\n' + pkg.homepage)
    ],
    module: {
        loaders: [{
            loader: "eslint-loader"
        }]
    }
};
