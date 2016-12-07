import fs from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import nconf from 'nconf';
import strings from './strings';

const vars = yaml.safeLoad(fs.readFileSync(resolve(__dirname, '../docs/config/vars.yml')));
const addScheme = (url) => {
  let scheme = 'https';
  if (process.env.NODE_ENV !== 'production' && nconf.get('HTTP_SECURE') !== true) {
    scheme = 'http';
  }

  return `${scheme}://${url}`;
};

export default Object.assign(vars, {
  account: {
    userName: '__AUTH0_USERNAME__',
    appName: '__AUTH0_APPNAME__',
    tenant: '__AUTH0_TENANT__',
    namespace: '__AUTH0_NAMESPACE__',
    clientId: '__AUTH0_CLIENT_ID__',
    clientSecret: '__AUTH0_CLIENT_SECRET__',
    callback: '__AUTH0_CALLBACK__'
  },
  connectionName: '__AUTH0_CONNECTION_NAME__',
  env: {
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    DOMAIN_URL_APP: addScheme(nconf.get('DOMAIN_URL_APP')),
    DOMAIN_URL_DOCS: nconf.get('DOMAIN_URL_DOCS'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    DWH_ENDPOINT: nconf.get('DWH_ENDPOINT'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    MOUSEFLOW_ID: nconf.get('MOUSEFLOW_ID'),
    PINGDOM_ID: nconf.get('PINGDOM_ID'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
    SENTRY_DSN: nconf.get('SENTRY_DSN'),
    SWIFTYPE_ENGINE_KEY: nconf.get('SWIFTYPE_ENGINE_KEY')
  },
  manage_url: addScheme(nconf.get('DOMAIN_URL_APP')),
  site: {
    title: strings.SITE_TITLE
  }
});
