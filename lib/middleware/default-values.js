import header from 'web-header';
import nconf from 'nconf';
import path from 'path';
import url from 'url';
import yaml from 'js-yaml';
import fs from 'fs';
import defaultCallback from '../default-callback';
import strings from '../strings';

const docsPath = nconf.get('DOCS_PATH') || path.resolve(__dirname, '../../docs/articles');
const navigation = yaml.safeLoad(fs.readFileSync(path.join(docsPath, '../config/navigation.yml')));

function fixLinks(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(fixLinks);
  } else {
    for (var key in obj) {
      var val = obj[key];
      if (Array.isArray(val)) {
        val.forEach(fixLinks);
      } else if (typeof val === 'object') {
        fixLinks(val);
      } else if (key === 'href') {
        obj[key] = '/docs' + val;
      }
    }
  }
}
fixLinks(navigation);


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

  // var escape = nconf.get('BASE_URL').replace(/\/([^\/]*)/ig, '/..');
  res.locals.webheader = header({
    base_url: 'https://auth0.com'
  });

  res.locals.site = {};
  res.locals.site.title = strings.SITE_TITLE;
  res.locals.navigation = navigation;
  res.locals.url = url.parse(req.url).pathname;
  res.locals.env = {
    DOMAIN_URL_DOCS: nconf.get('DOMAIN_URL_DOCS'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    COOKIE_SCOPE: nconf.get('COOKIE_SCOPE'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
    DWH_ENDPOINT: nconf.get('DWH_ENDPOINT')
  };

  next();
}
