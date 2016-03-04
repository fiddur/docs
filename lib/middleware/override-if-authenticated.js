import winston from 'winston';
import * as clients from '../clients';
import * as regions from '../regions';


export default function overrideIfAuthenticated(req, res, next) {
  if (!req.user || !req.user.tenant) {
    return next();
  }

  res.locals.user = {
    tenant: req.user.tenant,
    regions: req.user.regions
  };

  var params = {
    tenant: req.user.tenant.name,
    region: req.user.tenant.region
  };

  if (req.session.selectedClient) {
    params.clientID = req.session.selectedClient;
  }

  clients.find(params, function(err, clients) {
    if (err) {
      winston.error('error: ' + err);
      return next(err);
    }

    // filter user's clients
    if (!req.user.is_owner) {
      clients = clients.filter(function(c) {
        /* jshint -W016 */
        return c.owners && ~c.owners.indexOf(req.user.id);
        /* jshint +W034 */
      });
    }

    var globalClient = {},
      nonGlobalClients = [];

    clients.forEach(function(client) {
      if (client.global) {
        globalClient = client;
        return;
      }

      nonGlobalClients.push(client);
    });

    res.locals.account = res.locals.account || {};
    res.locals.account.loggedIn = true;
    res.locals.account.userName = req.user.name;

    res.locals.account.namespace = regions.get_namespace(req.user.tenant.region).replace('{tenant}', req.user.tenant.name);
    res.locals.account.tenant = req.user.tenant.name;

    res.locals.account.globalClientId = globalClient.clientID || 'YOUR_GLOBAL_CLIENT_ID';
    res.locals.account.globalClientSecret = globalClient.clientSecret;

    if (nonGlobalClients.length === 0) {
      return next();
    }

    res.locals.account.clients = nonGlobalClients;

    var client = nonGlobalClients[0];
    res.locals.account.appName = client.name && client.name.trim !== '' ? client.name : 'Your App';
    res.locals.account.clientId = client.clientID;
    res.locals.account.clientSecret = client.clientSecret;
    res.locals.account.callback = client.callback;
    res.locals.account.regions = req.regions;

    next();
  });
}
