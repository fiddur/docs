var LimitdClient = require('limitd').Client;
var winston      = require('winston');
var nconf        = require('nconf');

if (!nconf.get('LIMITD_SERVER')) return;

var client = new LimitdClient(nconf.get('LIMITD_SERVER'));

client.on('error', function (err) {
  winston.error('error from limitd', err);
});

module.exports = client;