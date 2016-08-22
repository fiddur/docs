import nconf from 'nconf';
import _ from 'lodash';

function addScheme(url) {
  let scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return scheme + '://' + url;
}

function removeScheme(url) {
  return url.slice(url.indexOf(':') + 1);
}

let env = {
  'AUTH0_DOMAIN':               nconf.get('AUTH0_DOMAIN'),
  'AUTH0_CLIENT_ID':            nconf.get('AUTH0_CLIENT_ID'),
  'AUTH0_ANGULAR_URL':          nconf.get('AUTH0_ANGULAR_URL'),
  'AUTH0_ANGULAR_URL_NOSCHEME': removeScheme(nconf.get('AUTH0JS_URL')),
  'AUTH0JS_URL':                nconf.get('AUTH0JS_URL'),
  'AUTH0JS_URL_NOSCHEME':       removeScheme(nconf.get('AUTH0JS_URL')),
  'COOKIE_SCOPE':               nconf.get('COOKIE_SCOPE'),
  'DOMAIN_URL_APP':             addScheme(nconf.get('DOMAIN_URL_APP')),
  'DOMAIN_URL_DOCS':            nconf.get('DOMAIN_URL_DOCS'),
  'DOMAIN_URL_SDK':             addScheme(nconf.get('DOMAIN_URL_SDK')),
  'DOMAIN_URL_SERVER':          nconf.get('DOMAIN_URL_SERVER'),
  'DWH_ENDPOINT':               nconf.get('DWH_ENDPOINT'),
  'LOCK_PASSWORDLESS_URL':      nconf.get('LOCK_PASSWORDLESS_URL'),
  'LOGIN_WIDGET_URL':           nconf.get('LOGIN_WIDGET_URL'),
  'LOGIN_WIDGET_URL_NOSCHEME':  removeScheme(nconf.get('LOGIN_WIDGET_URL')),
  'MEDIA_URL':                  nconf.get('MEDIA_URL'),
  'PINGDOM_ID':                 nconf.get('PINGDOM_ID'),
  'SEGMENT_KEY':                nconf.get('SEGMENT_KEY'),
  'SENTRY_DSN':                 nconf.get('SENTRY_DSN'),
};

export default function getEnvironmentVars(req, res) {
  // TODO: Add account information if necessary
  let vars = _.clone(env);
  vars['RENDER_MODE'] = (res.locals.framed) ? 'framed' : 'full';
  return vars;
}
