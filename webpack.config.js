'use strict'

var path = require('path')

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: [
      'vue',
      'vue-router'
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: path.resolve(__dirname, '/'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    modules: [
      path.join(__dirname, './node_modules')
    ],
    alias: {
      'src': path.resolve(__dirname, './src'),
    }
  },
  resolveLoader: {
    modules: [path.join(__dirname, './node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './'),
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      },
      {
        test: /\.css$/,
        loader: 'vue-style-loader'
      },
      {
        test: /\.sass$/,
        loader: 'vue-style-loader',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: ''
    })
  ],
}

console.log('webpack.config.js', 'module.exports', module.exports)
