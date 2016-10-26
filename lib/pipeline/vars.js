import fs from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import nconf from 'nconf';
import strings from '../strings';

const vars = yaml.safeLoad(fs.readFileSync(resolve(__dirname, '../../docs/config/vars.yml')));
const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';

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
    DOMAIN_URL_DOCS: nconf.get('DOMAIN_URL_DOCS'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
    DWH_ENDPOINT: nconf.get('DWH_ENDPOINT'),
    PINGDOM_ID: nconf.get('PINGDOM_ID'),
    SENTRY_DSN: nconf.get('SENTRY_DSN'),
    MOUSEFLOW_ID: nconf.get('MOUSEFLOW_ID')
  },
  manage_url: `${scheme}://${nconf.get('DOMAIN_URL_APP')}`,
  site: {
    title: strings.SITE_TITLE
  }
});
