import nconf from 'nconf';
import _ from 'lodash';

function addScheme(url) {
  const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${scheme}://${url}`;
}

const env = {
  AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
  AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
  DOMAIN_URL_APP: addScheme(nconf.get('DOMAIN_URL_APP')),
  DWH_ENDPOINT: nconf.get('DWH_ENDPOINT'),
  PINGDOM_ID: nconf.get('PINGDOM_ID'),
  SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
  SENTRY_DSN: nconf.get('SENTRY_DSN'),
  SWIFTYPE_ENGINE_KEY: nconf.get('SWIFTYPE_ENGINE_KEY')
};

export default function getEnvironmentVars(req, res) {
  // TODO: Add account information if necessary
  const vars = _.clone(env);
  return vars;
}
