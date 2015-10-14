var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var nconf = require('nconf');

require('./config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  //quiet: true,
  proxy: {
    '*': {
      target: 'http://localhost:5050'
    }
  }
}).listen(nconf.get('PORT'), function() {
  console.log('Webpack Dev Server listening on port ' + nconf.get('PORT'));
});
