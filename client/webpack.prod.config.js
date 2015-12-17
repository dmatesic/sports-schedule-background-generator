var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: [
        './src/index'
    ],
    module: {
        loaders: [{
            test: /\.js|\.jsx$/, // /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel?presets[]=react,presets[]=es2015']
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    }
};