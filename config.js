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
    sessionSecret: 'auth11 secret string',
    COOKIE_SCOPE: process.env.NODE_ENV === 'production' ? '.auth0.com' : null,
    COOKIE_NAME: 'auth0l',
    CURRENT_TENANT_COOKIE: 'current_tenant',
    DOMAIN_URL_SERVER: '{tenant}.auth0.com:3000',
    GUARDIAN_DOMAIN_URL: '{tenant}.guardian.auth0.com',
    DOMAIN_URL_APP: 'localhost:8989',
    PACKAGER_URL: 'http://localhost:8792',
    DOMAIN_URL_DOCS: 'http://localhost:3000/docs',
    PUBLIC_ALLOWED_TUTORIALS: '/adldap-auth?,/adldap-x?,/adfs?',
    AUTH0_TENANT: 'auth0-dev',
    AUTH0_CLIENT_ID: 'aCbTAJNi5HbsjPJtRpSP6BIoLPOrSj2C',
    AUTH0_CLIENT_SECRET: 'FBY0d4np9dCQZz1teQbsZSqrTdQI-yA55xPKUGUZgDxOco18yWupBk1MM-eBLme0',
    MEDIA_URL: (process.env.NODE_ENV === 'production' && nconf.get('DISABLE_CDN') !== 1) ? 'https://cdn.auth0.com/docs/media' : false,
    ASSET_URL: (process.env.NODE_ENV === 'production' && nconf.get('DISABLE_CDN') !== 1) ? 'https://cdn.auth0.com/docs' : false,
    DOCS_PATH: path.resolve(__dirname, './docs/'),
    PORT: 5050,
    CONSOLE_LOG_LEVEL: 'debug',
    LOG_TO_KINESIS_LEVEL: 'info',
    LOG_TO_WEB_LEVEL: 'error',
    PINGDOM_ID: process.env.NODE_ENV === 'production' ? '565cb401abe53d7b2cda7732' : false,
    ERROR_REPORTER_LOG_LEVEL: 'warning', // This is for server logging to sentry
    SENTRY_DSN: process.env.NODE_ENV === 'production' ?
    'https://1163d638cb0845b794909d26dca01fbb@sentry.io/102638' : false,
    SENTRY_DSN_MGMT_EXPLORER: process.env.NODE_ENV === 'production' ? 'https://778435f348ee46ca86f7f3f297f3d8a0@sentry.io/102847' : false,
    MOUSEFLOW_ID: process.env.NODE_ENV === 'production' ?
    '1f318101-e4cd-4d84-b95e-6a0e6771798d' : false,
    SWIFTYPE_ENGINE_KEY: 's-M2Jb8-xTC1XeyCpWZ1',
    TRELLO_LIST_ID: '57ec50a9ce30841a4b4aedf2',
    TRELLO_LABEL_ID: '57ec522e84e677fd369a6ba9',
    DOMAIN_URL_CDN: undefined
  });

if (nconf.get('COOKIE_NAME') !== 'auth0l') {
  nconf.set('CURRENT_TENANT_COOKIE', nconf.get('COOKIE_NAME') + '_current_tenant');
}

if (!nconf.get('AUTH0_DOMAIN') && nconf.get('AUTH0_TENANT') && nconf.get('DOMAIN_URL_SERVER')) {
  nconf.set('AUTH0_DOMAIN', nconf.get('DOMAIN_URL_SERVER').replace('{tenant}', nconf.get('AUTH0_TENANT')));
}

if (nconf.get('HEROKU_APP_NAME')) {
  // App is running in heroku, set some configs
  nconf.set('DOMAIN_URL_DOCS', 'https://' + nconf.get('HEROKU_APP_NAME') + '.herokuapp.com/docs');
  nconf.set('DOMAIN_URL_APP', 'https://manage.auth0.com');
}
