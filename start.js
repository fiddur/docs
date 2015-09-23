require('babel/register');

if (process.env.NODE_ENV !== 'development') {
  var cluster = require('cluster');

  if (cluster.isMaster && !module.parent) {
    return require('./master');
  }
}

// FOR TEST ONLY!!!
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

var http = require('http');
var nconf = require('nconf');
var app = require('./app');


/**
 * Export `docsapp` or boot a new https server
 * with it
 */

var server;

var application = {
  start: function (callback) {
    server = http.createServer(app);
    var enableDestroy = require('server-destroy');
    enableDestroy(server);
    server.listen(nconf.get('PORT'), callback);
  },
  stop: function (callback) {
    server.destroy(callback);
  }
};

if (module.parent) {
  module.exports = application;
} else {
  application.start(function () {
    console.log('Server listening on http://localhost:' + nconf.get('PORT'));
  });

  process.on('SIGTERM', function () {
    application.stop(function () {
      process.exit(0);
    });
  });
}
