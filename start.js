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

require('babel/register')({
  sourceMaps: (process.env.NODE_ENV === 'production') ? false : true,
  optional: ['es7.classProperties', 'es7.decorators']
});

var nconf = require('nconf');
var http = require('http');

require('./config');

/**
 * Export `docsapp` or boot a new https server
 * with it
 */

var server;

var port;
if (nconf.get('WEBPACK_PROXY_PORT')) {
  port = nconf.get('WEBPACK_PROXY_PORT');
} else {
  port = nconf.get('PORT');
}

var application = {
  start: function (callback) {
    var app = require('./server');
    server = http.createServer(app);
    var enableDestroy = require('server-destroy');
    enableDestroy(server);
    server.listen(port, callback);
  },
  stop: function (callback) {
    var timedout = false;

    var timeout = setTimeout(function () {
      timedout = true;
      callback();
    }, 5000);

    try {
      server.close(function () {
        if (timedout) return;
        clearTimeout(timeout);
        callback();
      });
    } catch (err) {
      console.log(err);
      clearTimeout(timeout);
      callback();
    }
  }
};

if (module.parent) {
  module.exports = application;
} else {
  application.start(function () {
    console.log('Server listening on http://localhost:' + port);
  });

  process.on('SIGINT', function () {
    application.stop(function () {
      process.exit();
    });
  });

  process.on('SIGTERM', function () {
    application.stop(function () {
      process.exit();
    });
  });
}
