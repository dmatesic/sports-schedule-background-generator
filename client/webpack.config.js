var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  module: {
    preLoaders: [{
      test: /\.js|\.jsx$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }],
    loaders: [{
      test: /\.js|\.jsx$/, // /\.js$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
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
    hot: true,
    proxy: {
      '/*': {
        target: 'http://localhost:4000/',
        secure: false
      },
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  eslint: {
    configFile: '.eslintrc'
  }
};