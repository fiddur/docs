var nconf = require('nconf');
var winston       = require('winston');
var bunyan_logger = require('./bunyan');

var bunyanTransport = new winston.Transport({
  level: nconf.get('CONSOLE_LOG_LEVEL')
});

bunyanTransport.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  bunyan_logger[level](meta || {}, msg);
  callback(null, true);
};

winston.remove(winston.transports.Console);
winston.add(bunyanTransport, null, true);