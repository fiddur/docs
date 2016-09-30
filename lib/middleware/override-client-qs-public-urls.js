import nconf from 'nconf';
import * as clients from '../clients';

export default function overrideIfClientInQsForPublicAllowedUrls(req, res, next) {

  var allowed = nconf.get('PUBLIC_ALLOWED_TUTORIALS').split(',').some(function(allowedUrl) {
    return req.originalUrl.indexOf(allowedUrl) === 0;
  });

  if (!allowed) return next();
  if (!req.query || !req.query.a) return next();

  //todo this doesn't work yet from a foreign region.
  //but these tutorials are not quite used

  clients.findByClientId(req.query.a, {
    signingKey: 0
  }, function(err, client) {
    if (err) {
      return next(err);
    }
    if (!client) {
      return res.status(404).send('client not found');
    }

    res.locals.account.appName = client.name && client.name.trim !== '' ? client.name : 'Your App';
    res.locals.account.namespace = nconf.get('DOMAIN_URL_SERVER').replace('{tenant}', client.tenant);
    res.locals.account.tenant = client.tenant;
    res.locals.account.clientId = client.clientID;
    res.locals.account.clientSecret = 'YOUR_CLIENT_SECRET'; // it's a public url (don't share client secret)
    res.locals.account.callback = client.callback;
    res.locals.connectionName = req.query.conn;

    next();
  });
}
