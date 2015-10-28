import header from 'web-header';
import nconf from 'nconf';
import path from 'path';
import url from 'url';
import yaml from 'js-yaml';
import fs from 'fs';
import defaultCallback from '../default-callback';

const docsPath = nconf.get('DOCS_PATH') || path.resolve(__dirname, '../../docs/articles');
const menus = yaml.safeLoad(fs.readFileSync(path.join(docsPath, '../config/menus.yml')));
const navigation = yaml.safeLoad(fs.readFileSync(path.join(docsPath, '../config/navigation.yml')));

export default function defaultValues(req, res, next) {
  res.locals.account = {};
  res.locals.account.clientParam = '';
  res.locals.account.userName = '';
  res.locals.account.appName = 'YOUR_APP_NAME';
  res.locals.account.tenant = 'YOUR_TENANT';
  res.locals.account.namespace = 'YOUR_NAMESPACE';
  res.locals.account.clientId = 'YOUR_CLIENT_ID';
  res.locals.account.clientSecret = 'YOUR_CLIENT_SECRET';
  res.locals.account.callback = defaultCallback(req) || 'http://YOUR_APP/callback';

  res.locals.base_url = nconf.get('DOMAIN_URL_DOCS');

  // var escape = nconf.get('BASE_URL').replace(/\/([^\/]*)/ig, '/..');
  res.locals.webheader = header({
    base_url: 'https://auth0.com'
  });

  res.locals.site = {};
  res.locals.site.title = nconf.get('SITE_TITLE');
  res.locals.site.menus = menus || {};
  res.locals.navigation = navigation;
  res.locals.url = url.parse(req.url).pathname;
  res.locals.env = {
    BASE_URL: nconf.get('BASE_URL'),
    DOMAIN_URL_DOCS: nconf.get('DOMAIN_URL_DOCS'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    COOKIE_SCOPE: nconf.get('COOKIE_SCOPE'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
    DWH_ENDPOINT: nconf.get('DWH_ENDPOINT')
  };

  res.locals.furl = function(rurl) {
    var _baseUrl = nconf.get('BASE_URL');
    if (_baseUrl && rurl.indexOf('/') === 0) {
      if (rurl === '/')
        return _baseUrl;
      else
        return _baseUrl + rurl;
    }
    return rurl;
  };

  next();
}
