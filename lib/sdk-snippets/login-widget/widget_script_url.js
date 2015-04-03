var nconf             = require('nconf');
var clients           = require('../../clients');

var env               = nconf.get('NODE_ENV');
var cdn               = nconf.get('CDN');
var disable_cdn       = nconf.get('DISABLE_CDN');
var DOMAIN_URL_SDK    = nconf.get('DOMAIN_URL_SDK');
var clients = require('../../clients');
var regions = require('../../regions');
var WIDGET_FALLBACK_CLIENTID = nconf.get('WIDGET_FALLBACK_CLIENTID');

/*
 * params {region, clientID}
 */
exports.get = function (params, done) {
  clients.find(params, function (err, clients) {
    if (err) return done(err);

    var client = clients && clients.length > 0 && clients[0];
    var clientID = client && client.clientID || WIDGET_FALLBACK_CLIENTID;

    var domain = regions.get_namespace(params.region).replace('{tenant}', client ? client.tenant : 'YOUR-DOMAIN');

    var tenant_domain = 'https://' + domain;

    var sdk_url;

    if (env === 'production' && !disable_cdn) {
      if (cdn) {
        sdk_url = 'https://' + DOMAIN_URL_SDK + '/auth0.js#client=' + clientID + '&cdn=https://' + cdn;
      } else {
        sdk_url = 'https://' + DOMAIN_URL_SDK + '/auth0.js#client=' + clientID;
      }
    } else {
      sdk_url = 'https://' + DOMAIN_URL_SDK + '/auth0.js#client=' + clientID + '&cdn=' + tenant_domain + '&assets=' + tenant_domain;
    }

    done(null, sdk_url, tenant_domain, client);
  });
};
