import nconf from 'nconf';
import defaultCallback from '../default-callback';
import * as clients from '../clients';
import * as regions from '../regions';

export default function urlVariables(req, res, next) {
  var scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  res.locals.uiURL = scheme + '://' + nconf.get('DOMAIN_URL_APP');
  res.locals.uiURLLoginCallback = res.locals.uiURL + '/callback';
  res.locals.sdkURL = scheme + '://' + nconf.get('DOMAIN_URL_SDK');

  if (res.locals.account && res.locals.account.clientId) {
    res.locals.uiAppSettingsURL = res.locals.uiURL + '/#/applications/' + res.locals.account.clientId + '/settings';
    res.locals.uiAppAddonsURL = res.locals.uiURL + '/#/applications/' + res.locals.account.clientId + '/addons';
    setTenantList();
  }

  function removeScheme(url) {
    return url.slice(url.indexOf(':') + 1);
  }

  // Auth0 client side Javascript URLs to use
  res.locals.auth0js_url = nconf.get('AUTH0JS_URL');
  res.locals.auth0js_url_no_scheme = removeScheme(nconf.get('AUTH0JS_URL'));

  res.locals.auth0_angular_url = nconf.get('AUTH0_ANGULAR_URL');
  res.locals.auth0_angular_url_no_scheme = removeScheme(nconf.get('AUTH0_ANGULAR_URL'));

  res.locals.widget_url = nconf.get('LOGIN_WIDGET_URL');
  res.locals.widget_url_no_scheme = removeScheme(nconf.get('LOGIN_WIDGET_URL'));

  res.locals.hasCallback = res.locals.account && !!res.locals.account.callback;

  // defualt values
  if (res.locals.account) {
    res.locals.account.callback = res.locals.account.callback ||
      defaultCallback(req) ||
      'http://YOUR_APP/callback';
  }
  // Generate list of all Tenants and Clients for this user
  function setTenantList() {
    var tenantList = [];

    if (!req.user || !req.user.tenant) {
      return;
    }

    if(req.user.regions) {
      req.user.regions.forEach(function(region) {
        var regionName = region.name;

        region.tenants.forEach(function(tenant) {
          var fullTenant = {
            region: regionName,
            tenant: tenant
          };

          clients.find(fullTenant, function(err, clients) {
            var clientsArray = [];

            clients.forEach(function(client) {
              if(client.global) {
                return;
              }

              clientsArray.push(client);
            });

            fullTenant.clients = clientsArray;

            tenantList.push(fullTenant);

            res.locals.account.tenantList = tenantList;
          });
        });
      });
    }
  }

  next();
}
