const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/' // Same as `output.publicPath` in most cases
}))

app.listen(3000, function() {
  console.log('Listening on port 3000!')
})
