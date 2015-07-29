import LimitdClient from 'limitd-client';
import winston from 'winston';
import nconf from 'nconf';

// Default export if running locally, etc.
var client = function() {
  throw new Error('no limitd server');
};

// If we have a server setup the client
if (nconf.get('LIMITD_SERVER')) {
  client = new LimitdClient(nconf.get('LIMITD_SERVER'));

  client.on('error', function(err) {
    winston.error('error from limitd', err);
  });
}

export default client;
