var nconf             = require('nconf');
var clients           = require('../../clients');

var env               = nconf.get('NODE_ENV');
var LOGIN_WIDGET_URL  = nconf.get('LOGIN_WIDGET_URL');
var AUTH0JS_URL       = nconf.get('AUTH0JS_URL');

var regions = require('../../regions');

exports.get = function (params, done) {
  clients.find(params, function (err, clients) {
    if (err) return done(err);

    var client = clients && clients.length > 0 && clients[0];

    var domain = regions.get_namespace(params.region).replace('{tenant}', client ? client.tenant : 'YOUR-DOMAIN');
    var tenant_domain = 'https://' + domain;
    var assets_url;

    if (env !== 'production') {
      assets_url = tenant_domain + '/';
    } else {
      var region = regions.get(params.region);
      if (region.assets) {
        assets_url = 'https://' + region.assets + '/';
      }
    }

    done(null, LOGIN_WIDGET_URL, assets_url, tenant_domain, domain, client, AUTH0JS_URL);
  });
};
