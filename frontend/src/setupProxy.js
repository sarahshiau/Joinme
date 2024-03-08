const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api',{
      
      target: 'http://localhost:8080',
      changeOrigin: true
      // target: "http://140.83.60.34:3306",
    })
  )
}
