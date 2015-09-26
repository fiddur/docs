import nconf from 'nconf';
import * as clients from '../../clients';
import * as regions from '../../regions';

const env = nconf.get('NODE_ENV');
const LOGIN_WIDGET_URL = nconf.get('LOGIN_WIDGET_URL');
const AUTH0JS_URL  = nconf.get('AUTH0JS_URL');
const LOCK_PASSWORDLESS_URL  = nconf.get('LOCK_PASSWORDLESS_URL');

export default function getWidgetScriptUrl(params, done) {
  clients.find(params, function (err, clients) {
    if (err) return done(err);

    var client = clients && clients.length > 0 && clients[0];

    var domain = regions.get_namespace(params.region).replace('{tenant}', client ? client.tenant : 'YOUR-DOMAIN');
    var tenant_domain = 'https://' + domain;
    var assets_url;

    if (env !== 'production') {
      assets_url = tenant_domain + '/';
    }

    done(null, LOGIN_WIDGET_URL, assets_url, tenant_domain, domain, client, AUTH0JS_URL, LOCK_PASSWORDLESS_URL);
  });
}
