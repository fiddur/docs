var LimitdClient = require('limitd-client');
var winston      = require('winston');
var nconf        = require('nconf');

// Default export if running locally, etc.
var client = function() {
  throw new Error('no limitd server');
};

// If we have a server setup the client
if (nconf.get('LIMITD_SERVER')) {
  client = new LimitdClient(nconf.get('LIMITD_SERVER'));

  client.on('error', function (err) {
    winston.error('error from limitd', err);
  });
}

export default client;
