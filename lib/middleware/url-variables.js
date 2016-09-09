import nconf from 'nconf';
import defaultCallback from '../default-callback';
import { getAssetBundleUrl } from '../utils';

export default function urlVariables(req, res, next) {
  var scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  // Manage Portal Url
  res.locals.manage_url = scheme + '://' + nconf.get('DOMAIN_URL_APP');

  if (res.locals.account && res.locals.account.clientId) {
    res.locals.uiAppSettingsURL = res.locals.uiURL + '/#/applications/' + res.locals.account.clientId + '/settings';
    res.locals.uiAppAddonsURL = res.locals.uiURL + '/#/applications/' + res.locals.account.clientId + '/addons';
  }

  function removeScheme(url) {
    return url.slice(url.indexOf(':') + 1);
  }

  // Auth0 client side Javascript URLs to use
  res.locals.auth0js_url = nconf.get('AUTH0JS_URL');
  res.locals.auth0js_url_no_scheme = removeScheme(nconf.get('AUTH0JS_URL'));

  // Lock URLs
  res.locals.lock_url = nconf.get('LOCK_URL');
  res.locals.lock_url_no_scheme = removeScheme(nconf.get('LOCK_URL'));
  res.locals.lock_passwordless_url = nconf.get('LOCK_PASSWORDLESS_URL');

  res.locals.hasCallback = res.locals.account && !!res.locals.account.callback;

  res.locals.getAssetBundleUrl = getAssetBundleUrl;

  // defualt values
  if (res.locals.account) {
    res.locals.account.callback = res.locals.account.callback ||
      defaultCallback(req) ||
      'http://YOUR_APP/callback';
  }

  next();
}
