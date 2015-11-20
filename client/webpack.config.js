var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['react-hot', 'jsx-loader']
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};