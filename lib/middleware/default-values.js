import nconf from 'nconf';
import url from 'url';
import strings from '../strings';

const manageUrl = `${process.env.NODE_ENV === 'production' || nconf.get('HTTP_SECURE') !== true ?
  'https' : 'http'}://${nconf.get('DOMAIN_URL_APP')}`;

/* eslint-disable no-param-reassign */

export default function defaultValues(req, res, next) {
  res.locals.account = {};
  res.locals.account.userName = '';
  res.locals.account.appName = 'YOUR_APP_NAME';
  res.locals.account.tenant = 'YOUR_TENANT';
  res.locals.account.namespace = 'YOUR_AUTH0_DOMAIN';
  res.locals.account.clientId = 'YOUR_CLIENT_ID';
  res.locals.account.clientSecret = 'YOUR_CLIENT_SECRET';
  res.locals.account.callback = 'https://YOUR_APP/callback';

  res.locals.connectionName = 'YOUR_CONNECTION_NAME';

  res.locals.site = {};
  res.locals.site.title = strings.SITE_TITLE;
  res.locals.url = url.parse(req.url).pathname;
  res.locals.manage_url = manageUrl;
  res.locals.env = {
    DOMAIN_URL_APP: nconf.get('DOMAIN_URL_APP'),
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
  };

  next();
}
