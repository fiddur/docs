var logger = require('./bunyan');

var EventLogger = require('auth0-common-logging').EventLogger;

module.exports = new EventLogger(logger);
