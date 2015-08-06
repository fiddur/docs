require('babel/register')({
  sourceMaps: (process.env.NODE_ENV === 'production') ? false : 'inline'
});

if (process.env.NODE_ENV !== 'development') {
  var cluster = require('cluster');

  if (cluster.isMaster && !module.parent) {
    return require('./master');
  }
}

// FOR TEST ONLY!!!
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/**
 * Module dependencies.
 */

var redirect = require('express-redirect');
var prerender = require('prerender-node');
var passport = require('passport');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var logger = require('morgan');
var nconf = require('nconf');
var http = require('http');
var path = require('path');
var fs = require('fs');
var sitemap = require('express-sitemap');

var app = redirect(express());

var config_file = process.env.CONFIG_FILE || path.join(__dirname, 'config.json');
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
    'DOMAIN_URL_DOCS':   'https://localhost:5050',
    'DOMAIN_URL_API2_EXPLORER': 'login0.myauth0.com',
    'WIDGET_FALLBACK_CLIENTID': 'aCbTAJNi5HbsjPJtRpSP6BIoLPOrSj2C',
    'LEGACY_WIDGET_URL':  'https://cdn.auth0.com/w2/auth0-widget-5.2.min.js',
    'LOGIN_WIDGET_URL':  'https://cdn.auth0.com/js/lock-6.2.min.js',
    'AUTH0JS_URL':       'https://cdn.auth0.com/w2/auth0-1.6.4.min.js',
    'AUTH0_ANGULAR_URL': 'http://cdn.auth0.com/w2/auth0-angular-1.1.js',
    'SENSITIVE_DATA_ENCRYPTION_KEY': '0123456789',
    'HMAC_ENCRYPTION_KEY': 'abcdefghij',
    'PUBLIC_ALLOWED_TUTORIALS': '/adldap-auth?,/adldap-x?,/adfs?',
    'AUTH0_TENANT': 'auth0-dev',
    'AUTH0_CLIENT_ID': 'aCbTAJNi5HbsjPJtRpSP6BIoLPOrSj2C',
    'AUTH0_CLIENT_SECRET': 'FBY0d4np9dCQZz1teQbsZSqrTdQI-yA55xPKUGUZgDxOco18yWupBk1MM-eBLme0',
    'PRERENDER_ENABLED': false,
    'BASE_URL': '',
    'MEDIA_URL': process.env.NODE_ENV === 'production' ? 'https://cdn.auth0.com/docs/media' : false,
    'DOCS_PATH': __dirname + '/docs/articles',
    'PORT': 5050
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

if (nconf.get('PRERENDER_SERVICE_URL')) {
  prerender.set('prerenderServiceUrl', nconf.get('PRERENDER_SERVICE_URL'));
}

if (nconf.get('PRERENDER_TOKEN')) {
  prerender.set('prerenderToken', nconf.get('PREPRENDER_TOKEN'));
}

if (nconf.get('PRERENDER_PROTOCOL')) {
  prerender.set('protocol', nconf.get('PRERENDER_PROTOCOL'));
}

require('./lib/setup-logger');

passport.serializeUser(function(user, done) {
  if (!nconf.get('db')) {
    return done(null, user);
  }
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  if (!nconf.get('db')) {
    return done(null, id);
  }

  var getDb = require('./lib/data');
  getDb(function(db){
    var userColl = db.collection('tenantUsers');
    userColl.findOne({id: id}, done);
  });
});

app.set('views', path.join(__dirname, 'themes/default/views'));
app.set('view engine', 'jade');
app.enable('trust proxy');

if (nconf.get('NODE_ENV') === 'production') {
  app.use(function(req, res, next){
    if (nconf.get('dontForceHttps') || req.originalUrl === '/test') return next();

    if(req.headers['x-forwarded-proto'] !== 'https')
      return res.redirect(nconf.get('DOMAIN_URL_DOCS') + req.url);

    next();
  });
}

if (nconf.get('PRERENDER_ENABLED')) {
  // Add swiftype UserAgent bot
  prerender.crawlerUserAgents.push('Swiftbot');
  prerender.crawlerUserAgents.push('Slackbot-LinkExpanding');
  // add prerender middleware
  app.use(prerender);
}

app.use('/test', function (req, res) {
  res.sendStatus(200);
});

app.use(nconf.get('BASE_URL') + '/test', function (req, res) {
  res.sendStatus(200);
});

app.use(function (req, res, next) {
  if (!nconf.get('BASE_URL') || req.url === '/') return next();
  req.url = req.url.replace(/\/$/,'');
  next();
});

if (nconf.get('NODE_ENV') !== 'test') {
  app.use(logger('dev'));
}


var middleware = require('./lib/middleware');
var sessionStore = require('./lib/session-store');

app.use(middleware.cors);
app.use(cookieParser());
app.use(session({
  secret: nconf.get('sessionSecret'),
  store: sessionStore ? sessionStore(session) : undefined,
  key: nconf.get('COOKIE_NAME'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    domain:   nconf.get('COOKIE_SCOPE'),
    path:     '/',
    httpOnly: true,
    maxAge:   null,
    secure:   !nconf.get('dontForceHttps') && nconf.get('NODE_ENV') === 'production'
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

app.use(nconf.get('BASE_URL') + '/media', express.static(path.join(__dirname, 'docs/media')));
['css', 'img', 'js', 'vendor'].forEach(function(folder) {
  app.use(nconf.get('BASE_URL') + '/' + folder, express.static(path.join(__dirname, '/themes/default/public/', folder)));
});


app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.setCurrentTenant);
app.use(middleware.setUserIsOwner);
app.use(middleware.defaultValues);
app.use(middleware.urlVariables);
app.use(middleware.overrideIfAuthenticated);

var connections = require('./lib/connections');
app.get('/ticket/step', function (req, res) {
  if (!req.query.ticket) return res.sendStatus(404);
  connections.getCurrentStep(req.query.ticket, function (err, currentStep) {
    if (err) return res.sendStatus(500);
    if (!currentStep) return res.sendStatus(404);
    res.send(currentStep);
  });
});

app.get(nconf.get('BASE_URL') + '/switch', function (req, res) {
  req.session.current_tenant = {
    name: req.query.tenant,
    region: req.query.region,
  };
  res.redirect(nconf.get('BASE_URL') || '/');
});

var quickstartCollections = require('./lib/collections/quickstarts');
app.get(nconf.get('BASE_URL'), function(req, res) {
  res.render('homepage', { quickstarts: quickstartCollections });
});

/**
 * Manage redirect 301 for deprecated links
 * to point to new links or documents
 */

require('./lib/redirects')(app);

/**
 * Register quickstart routes as an alias to index `/`
 * So that the tutorial navigator gets to load
 * quickstart collections and render
 */
var quickstart = require('./lib/quickstart');

function alias(route) {
  return function(req, res, next) {
    req.url = route;
    next();
  };
}

quickstart.routes.forEach(function(route) {
  app.get(nconf.get('BASE_URL') + '/quickstart' + route, alias(nconf.get('BASE_URL') || '/'));
});

app.get(nconf.get('BASE_URL') + '/quickstart', alias(nconf.get('BASE_URL') || '/'));


app.use(nconf.get('BASE_URL'), require('./lib/api-explorer'));
app.use(nconf.get('BASE_URL'), require('./lib/docs').router);

require('./lib/sdk-snippets/lock/demos-routes')(app);
require('./lib/sdk-snippets/lock/snippets-routes')(app);
require('./lib/sdk-snippets/login-widget2/demos-routes')(app);
require('./lib/sdk-snippets/login-widget2/snippets-routes')(app);
require('./lib/sdk-snippets/login-widget/demos-routes')(app);

app.use(nconf.get('BASE_URL'), require('./lib/packager'));

// Sitemap
var map = sitemap({
  generate: app,
  cache: 60000,
  route: {
    'ALL': {
      changefreq: 'weekly',
    }
  }
});
app.get(nconf.get('BASE_URL') + '/sitemap.xml', function(req, res) {
  map.XMLtoWeb(res);
});

app.use(nconf.get('BASE_URL') + '/meta', require('./lib/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/**
 * Export `docsapp` or boot a new https server
 * with it
 */

var server;

var application = {
  start: function (callback) {
    server = http.createServer(app);
    var enableDestroy = require('server-destroy');
    enableDestroy(server);
    server.listen(nconf.get('PORT'), callback);
  },
  stop: function (callback) {
    server.destroy(callback);
  }
};

if (module.parent) {
  module.exports = application;
} else {
  application.start(function () {
    console.log('Server listening on http://localhost:' + nconf.get('PORT'));
  });

  process.on('SIGTERM', function () {
    application.stop(function () {
      process.exit(0);
    });
  });
}
