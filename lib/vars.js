import fs from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import nconf from 'nconf';
import strings from './strings';

const vars = yaml.safeLoad(fs.readFileSync(resolve(__dirname, '../docs/config/vars.yml')));
const addScheme = (url) => {
  const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${scheme}://${url}`;
};

export default Object.assign(vars, {
  account: {
    userName: '',
    appName: 'YOUR_APP_NAME',
    tenant: 'YOUR_TENANT',
    namespace: 'YOUR_NAMESPACE',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callback: 'https://YOUR_APP/callback'
  },
  connectionName: 'YOUR_CONNECTION_NAME',
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
