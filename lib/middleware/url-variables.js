import nconf from 'nconf';
import defaultCallback from '../default-callback';

export default function urlVariables(req, res, next) {
  var scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  res.locals.uiURL = scheme + '://' + nconf.get('DOMAIN_URL_APP');
  res.locals.uiURLLoginCallback = res.locals.uiURL + '/callback';
  res.locals.sdkURL = scheme + '://' + nconf.get('DOMAIN_URL_SDK');

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

  res.locals.auth0_angular_url = nconf.get('AUTH0_ANGULAR_URL');
  res.locals.auth0_angular_url_no_scheme = removeScheme(nconf.get('AUTH0_ANGULAR_URL'));

  res.locals.widget_url = nconf.get('LOGIN_WIDGET_URL');
  res.locals.lock_passwordless_url = nconf.get('LOCK_PASSWORDLESS_URL');
  res.locals.widget_url_no_scheme = removeScheme(nconf.get('LOGIN_WIDGET_URL'));

  res.locals.hasCallback = res.locals.account && !!res.locals.account.callback;

  // defualt values
  if (res.locals.account) {
    res.locals.account.callback = res.locals.account.callback ||
      defaultCallback(req) ||
      'http://YOUR_APP/callback';
  }

  next();
}
