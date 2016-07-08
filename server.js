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
import helmet from 'helmet';

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

server.use('/docs/test', function (req, res) {
  res.sendStatus(200);
});

// server.use('/docs', function (req, res, next) {
//   if (req.url === '/docs') return next();
//   req.url = req.url.replace(/\/$/,'');
//   next();
// });

if (nconf.get('NODE_ENV') !== 'test') {
  server.use(require('./lib/middleware/log_request'));
}


var middleware = require('./lib/middleware');
var sessionStore = require('./lib/session-store');


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


// security headers
server.use(middleware.csp);
server.use(middleware.cors);
server.use(function(req, res, next) {
  if (req.path.indexOf('/docs/lock-demos/') === 0) {
    // Lock demos are used on manage.auth0.com and X-Frame-Options
    // doesn't support multiple values so we allow all hosts for this path
    next();
  } else {
    // For all other paths, we deny
    helmet.frameguard({ action: 'sameorigin' })(req, res, next);
  }
});
server.use(helmet.hsts( { maxAge: 31536000000 } ));
server.use(helmet.xssFilter());
server.use(helmet.noSniff());
server.use(helmet.hidePoweredBy());

server.use(methodOverride());

server.use('/docs/media', express.static(path.join(__dirname, 'docs/media')));
['css', 'img', 'js', 'vendor'].forEach(function(folder) {
  server.use('/docs/' + folder, express.static(path.join(__dirname, '/public/', folder)));
});


server.use(passport.initialize());
server.use(passport.session());
server.use(middleware.setCurrentTenant);
server.use(middleware.configuration);
server.use(middleware.setUserIsOwner);
server.use(middleware.defaultValues);
server.use(middleware.embedded);
server.use(middleware.overrideIfAuthenticated);
server.use(middleware.overrideIfClientInQs);
server.use(middleware.overrideIfClientInQsForPublicAllowedUrls);
server.use(middleware.urlVariables);
server.use(middleware.fetchABExperiments);
server.use(middleware.redirectQuickstarts);

// Routes
server.use('/docs', require('./lib/api-explorer'));
server.use('/docs', require('./lib/sdk-snippets/lock/demos-routes'));
server.use('/docs', require('./lib/sdk-snippets/lock/snippets-routes'));
server.use('/docs', require('./lib/packager'));
server.use('/docs', require('./lib/feedback'));
server.use('/docs', require('./lib/sitemap'));
server.use('/docs', require('./lib/search'));
server.use('/docs', require('./lib/updates'));
server.use('/docs', require('./lib/redirects'));
server.use('/docs', require('./lib/handler'));

server.get('/docs/switch', function (req, res) {
  req.session.current_tenant = {
    name: req.query.tenant,
    region: req.query.region,
  };
  res.redirect('/docs');
});


server.use('/docs/meta', require('./lib/api'));

// This is just for localhost
server.get('/', function(req, res) {
  res.redirect('/docs');
});

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
function renderError(req, res, err) {
  res.status(err.status || 500);
  if (res.locals.json) {
    res.json(err);
  } else if (res.locals.jsonp) {
    res.jsonp(err);
  } else if (res.locals.embedded) {
    res.render('error-embedded', err);
  } else if (res.locals.framed) {
    res.render('error-framed', err);
  } else {
    res.render('error', err);
  }
}

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
  server.use(function(err, req, res, next) {
    renderError(req ,res, {
      status: err.status,
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
  renderError(req, res, {
    status: err.status,
    message: msg,
    error: {}
  });
});

export default server;
