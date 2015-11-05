/**
 * Module dependencies.
 */
import passport from 'passport';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import nconf from 'nconf';
import path from 'path';
import winston from 'winston';
import strings from './lib/strings';

var server = express();

require('./lib/logs/setup');
var eventLogger = require('./lib/logs/eventLogger');
eventLogger.watch(process);

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

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');
server.enable('trust proxy');

if (nconf.get('NODE_ENV') === 'production') {
  server.use(function(req, res, next){
    if (nconf.get('dontForceHttps') || req.originalUrl === '/test') return next();

    if(req.headers['x-forwarded-proto'] !== 'https')
      return res.redirect(nconf.get('DOMAIN_URL_DOCS') + req.url);

    next();
  });
}

server.use('/test', function (req, res) {
  res.sendStatus(200);
});

server.use(nconf.get('BASE_URL') + '/test', function (req, res) {
  res.sendStatus(200);
});

server.use(function (req, res, next) {
  if (!nconf.get('BASE_URL') || req.url === '/') return next();
  req.url = req.url.replace(/\/$/,'');
  next();
});

if (nconf.get('NODE_ENV') !== 'test') {
  server.use(require('./lib/middleware/log_request'));
}


var middleware = require('./lib/middleware');
var sessionStore = require('./lib/session-store');

server.use(middleware.cors);
server.use(cookieParser());
server.use(session({
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

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(methodOverride());

server.use(nconf.get('BASE_URL') + '/media', express.static(path.join(__dirname, 'docs/media')));
['css', 'img', 'js', 'vendor'].forEach(function(folder) {
  server.use(nconf.get('BASE_URL') + '/' + folder, express.static(path.join(__dirname, '/public/', folder)));
});


server.use(passport.initialize());
server.use(passport.session());
server.use(middleware.setCurrentTenant);
server.use(middleware.configuration);
server.use(middleware.setUserIsOwner);
server.use(middleware.defaultValues);
server.use(middleware.urlVariables);
server.use(middleware.embedded);
server.use(middleware.overrideIfAuthenticated);
server.use(middleware.overrideIfClientInQs);
server.use(middleware.overrideIfClientInQsForPublicAllowedUrls);
server.use(middleware.fetchABExperiments);
server.use(middleware.clientConfig); // MUST BE LAST!!!

// Routes
server.use(nconf.get('BASE_URL'), require('./lib/api-explorer'));
server.use(nconf.get('BASE_URL'), require('./lib/docs').router);
server.use(nconf.get('BASE_URL'), require('./lib/sdk-snippets/lock/demos-routes'));
server.use(nconf.get('BASE_URL'), require('./lib/sdk-snippets/lock/snippets-routes'));
server.use(nconf.get('BASE_URL'), require('./lib/packager'));
server.use(nconf.get('BASE_URL'), require('./lib/feedback'));
server.use(nconf.get('BASE_URL'), require('./lib/redirects'));
server.use(nconf.get('BASE_URL'), require('./lib/sitemap'));
server.use(nconf.get('BASE_URL'), require('./lib/search'));

var connections = require('./lib/connections');
server.get('/ticket/step', function (req, res) {
  if (!req.query.ticket) return res.sendStatus(404);
  connections.getCurrentStep(req.query.ticket, function (err, currentStep) {
    if (err) return res.sendStatus(500);
    if (!currentStep) return res.sendStatus(404);
    res.send(currentStep);
  });
});

server.get(nconf.get('BASE_URL') + '/switch', function (req, res) {
  req.session.current_tenant = {
    name: req.query.tenant,
    region: req.query.region,
  };
  res.redirect(nconf.get('BASE_URL') || '/');
});

server.use(nconf.get('BASE_URL') + '/meta', require('./lib/api'));

// React client middleware -> homepage, quickstart, etc.
var quickstartMiddleware = require('./lib/quickstart').middleware;
var reactMiddleware = require('./client/middleware');
server.use(quickstartMiddleware, reactMiddleware);

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
  server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
  var msg = strings.ERROR_PROCESSING_REQUEST;
  if (err.status === 404) {
    msg = strings.PAGE_NOT_FOUND;
    winston.warn('Page not found: ' + req.url, { err: err });
  } else {
    winston.error('Error loading route: ' + req.url, { err: err });
  }
  res.status(err.status || 500);
  res.render('error', {
    message: msg,
    error: {}
  });
});

export default server;