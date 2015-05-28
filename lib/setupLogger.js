var winston = require('winston');
var url     = require('url');
var nconf   = require('nconf');

winston.remove(winston.transports.Console);

winston.add(winston.transports.Console, {
  colorize:    true,
  level:       nconf.get('CONSOLE_LOG_LEVEL'),
  prettyPrint: true,
  handleExceptions: true
});

if(nconf.get('NODE_ENV') === "production" && nconf.get('LOG_TO_WEB_URL')) {
  var parsedLogToWebUrl = url.parse(nconf.get('LOG_TO_WEB_URL'));

  winston.add(winston.transports.Webhook, {
    host:   parsedLogToWebUrl.hostname,
    port:   parseInt(parsedLogToWebUrl.port || 80, 10),
    method: 'POST',
    path:   parsedLogToWebUrl.path,
    level:  nconf.get('LOG_TO_WEB_LEVEL') || 'error',
    handleExceptions: true
  });
}
