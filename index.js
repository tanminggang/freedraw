console.log('freedraw', 'index', 'process.env.NODE_ENV', process.env.NODE_ENV)

var path = require('path')

var express = require('express')
var webpack = require('webpack')
var webpackConfig = require('./webpack.conf')

// default port where dev server listens for incoming traffic
var port = 8080

var app = express()
try {
  var compiler = webpack(webpackConfig, function (err, stats) {
    console.log('compiler', 'callb')
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
} catch (ex) {
  console.log('compiler', 'CATCH', ex)
}

// serve webpack bundle output
console.log('index', 'devMiddleware')
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

// enable hot-reload and state-preserving
// compilation error display
console.log('index', 'hotMiddleware')
var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
