import nconf from 'nconf';
import defaultCallback from '../default-callback';

const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';
function removeScheme(url) {
  return url.slice(url.indexOf(':') + 1);
}

export default function urlVariables(req, res, next) {

  // Manage Portal Url
  res.locals.manage_url = `${scheme}://${nconf.get('DOMAIN_URL_APP')}`;

  // Javascript Library URLs
  res.locals.auth0js_url = nconf.get('AUTH0JS_URL');
  res.locals.lock_url = nconf.get('LOCK_URL');
  res.locals.lock_passwordless_url = nconf.get('LOCK_PASSWORDLESS_URL');

  next();
}
