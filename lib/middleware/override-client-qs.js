import * as clients from '../clients';
import * as regions from '../regions';

export default function overrideIfClientInQs(req, res, next) {
  if (!req.query || !req.query.a) {
    return next();
  }
  if (!req.user || !req.user.tenant) {
    return next();
  }

  var params = {
    tenant: req.user.tenant.name,
    region: req.user.tenant.region,
    clientID: req.query.a
  };

  clients.find(params, function(err, clients) {
    if (err) {
      return next(err);
    }

    var client = clients && clients.length > 0 && clients[0];

    if (!client) {
      return res.status(404).send('client not found');
    }
    if (!req.user.is_owner && (!client.owners || client.owners.indexOf(req.user.id) < 0)) {
      return res.sendStatus(401);
    }

    res.locals.account.appName = client.name && client.name.trim !== '' ? client.name : 'Your App';
    res.locals.account.namespace = regions.get_namespace(req.user.tenant.region).replace('{tenant}', req.user.tenant.name);
    res.locals.account.tenant = client.tenant;
    res.locals.account.clientId = client.clientID;
    res.locals.account.clientSecret = client.clientSecret;
    res.locals.account.callback = client.callback;
    res.locals.connectionName = req.query.conn;

    next();
  });
}
