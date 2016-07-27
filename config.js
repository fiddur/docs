var nconf = require('nconf');
var path = require('path');
var fs = require('fs');

var config_file = process.env.CONFIG_FILE || path.join(__dirname, './config.json');
var extra_configs = config_file.slice(0, -5) + '.d';

nconf
  .use('memory')
  .argv()
  .env();

if (fs.existsSync(extra_configs)) {
  fs.readdirSync(extra_configs).forEach(function (f) {
    nconf.file(f, extra_configs + '/' + f);
  });
}

nconf.file('global', { file: config_file })
  .defaults({
    'sessionSecret':     'auth11 secret string',
    'COOKIE_SCOPE':      process.env.NODE_ENV === 'production' ? '.auth0.com' : null,
    'COOKIE_NAME':       'auth0l',
    'CURRENT_TENANT_COOKIE': 'current_tenant',
    'DOMAIN_URL_SERVER': '{tenant}.auth0.com:3000',
    'DOMAIN_URL_APP':    'localhost:8989',
    'DOMAIN_URL_SDK':    'login-dev.auth0.com:3000',
    'PACKAGER_URL':      'http://localhost:8792',
    'DOMAIN_URL_DOCS':   'http://localhost:3000/docs',
    'DOMAIN_URL_API2_EXPLORER': 'login0.myauth0.com',
    'WIDGET_FALLBACK_CLIENTID': 'aCbTAJNi5HbsjPJtRpSP6BIoLPOrSj2C',
    'LOGIN_WIDGET_URL':  'https://cdn.auth0.com/js/lock/10.0/lock.min.js',
    'LOCK_PASSWORDLESS_URL':  'https://cdn.auth0.com/js/lock-passwordless-1.0.min.js',
    'AUTH0JS_URL':       'https://cdn.auth0.com/w2/auth0-6.8.min.js',
    'AUTH0_ANGULAR_URL': 'http://cdn.auth0.com/w2/auth0-angular-1.1.js',
    'SENSITIVE_DATA_ENCRYPTION_KEY': '0123456789',
    'HMAC_ENCRYPTION_KEY': 'abcdefghij',
    'PUBLIC_ALLOWED_TUTORIALS': '/adldap-auth?,/adldap-x?,/adfs?',
    'AUTH0_TENANT': 'auth0-dev',
    'AUTH0_CLIENT_ID': 'aCbTAJNi5HbsjPJtRpSP6BIoLPOrSj2C',
    'AUTH0_CLIENT_SECRET': 'FBY0d4np9dCQZz1teQbsZSqrTdQI-yA55xPKUGUZgDxOco18yWupBk1MM-eBLme0',
    'AUTH0_EMPLOYEE_EMAIL_DOMAIN': '@auth0.com',
    'GITHUB_DOCS_ORG': 'auth0',
    'GITHUB_DOCS_REPO': 'docs',
    'MEDIA_URL': (process.env.NODE_ENV === 'production' && nconf.get('DISABLE_CDN') !== 1) ? 'https://cdn.auth0.com/docs/media' : false,
    'ASSET_URL': (process.env.NODE_ENV === 'production' && nconf.get('DISABLE_CDN') !== 1) ? 'https://cdn.auth0.com/docs/assets' : false,
    'DOCS_PATH': path.resolve(__dirname, './docs/'),
    'PORT': 5050,
    'CONSOLE_LOG_LEVEL': 'debug',
    'LOG_TO_KINESIS_LEVEL': 'info',
    'LOG_TO_WEB_LEVEL':     'error',
    'SEARCH_ENGINE_ID': '010795999221123445302:urkvlewda8q', // Google Site Search ID
    'PINGDOM_ID': process.env.NODE_ENV === 'production' ? '565cb401abe53d7b2cda7732' : false,
    'SENTRY_DSN': process.env.NODE_ENV === 'production' ? 'https://29ef6b5c3bbd4b9ba9f5710014e20c03@app.getsentry.com/57750' : false,
    'MOUSEFLOW_ID': process.env.NODE_ENV === 'production' ? '1f318101-e4cd-4d84-b95e-6a0e6771798d' : false
  });

if (nconf.get('COOKIE_NAME') !== 'auth0l') {
  nconf.set('CURRENT_TENANT_COOKIE', nconf.get('COOKIE_NAME') + '_current_tenant');
}

if (!nconf.get('LOGIN_WIDGET_URL')) {
  nconf.set('LOGIN_WIDGET_URL', 'https://' + nconf.get('DOMAIN_URL_SDK') + '/w2/auth0-widget.min.js');
}

if (!nconf.get('AUTH0JS_URL')) {
  nconf.set('AUTH0JS_URL', 'https://' + nconf.get('DOMAIN_URL_SDK') + '/w2/auth0.min.js');
}

if (!nconf.get('AUTH0_DOMAIN') && nconf.get('AUTH0_TENANT') && nconf.get('DOMAIN_URL_SERVER')) {
  nconf.set('AUTH0_DOMAIN', nconf.get('DOMAIN_URL_SERVER').replace('{tenant}', nconf.get('AUTH0_TENANT')));
}
