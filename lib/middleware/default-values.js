import header from 'web-header';
import nconf from 'nconf';
import default_callback from '../default_callback';

export default function (req, res, next) {
  res.locals.account = {};
  res.locals.account.clientParam = '';
  res.locals.account.userName     = '';
  res.locals.account.appName      = 'YOUR_APP_NAME';
  res.locals.account.tenant       = 'YOUR_TENANT';
  res.locals.account.namespace    = 'YOUR_NAMESPACE';
  res.locals.account.clientId     = 'YOUR_CLIENT_ID';
  res.locals.account.clientSecret = 'YOUR_CLIENT_SECRET';
  res.locals.account.callback     = default_callback.get(req) || 'http://YOUR_APP/callback';

  res.locals.base_url             = nconf.get('DOMAIN_URL_DOCS');

  // var escape = nconf.get('BASE_URL').replace(/\/([^\/]*)/ig, '/..');
  res.locals.webheader            = header({ base_url: 'https://auth0.com' });
  next();
}
