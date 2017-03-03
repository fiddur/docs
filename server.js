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
import helmet from 'helmet';
import strings from './lib/strings';
import agent from './lib/logs';
import eventLogger from './lib/logs/event-logger';
import requestLogger from './lib/logs/request-logger';
import bootstrap from './lib/bootstrap';
import defaultValues from './lib/middleware/default-values';
import overrideIfAuthenticated from './lib/middleware/override-if-authenticated';
import overrideClientQsPublic from './lib/middleware/override-client-qs-public-urls';
import overrideClientQs from './lib/middleware/override-client-qs';
import setCurrentTenant from './lib/middleware/set-current-tenant';
import setModeFlags from './lib/middleware/set-mode-flags';
import setUserIsOwner from './lib/middleware/set-user-is-owner';
import docsVariables from './lib/middleware/docs-variables';
import fetchABExperiments from './lib/middleware/ab-testing';
import redirectQuickstarts from './lib/middleware/redirect-quickstarts';
import sessionStore from './lib/session-store';
import cors from './lib/middleware/cors';

const logger = agent.logger;

const server = express();

eventLogger.watch(process);

server.use(agent.errorReporter.express.requestHandler);
server.use(agent.errorReporter.express.errorHandler);

passport.serializeUser((user, done) => {
  if (!nconf.get('db')) {
    return done(null, user);
  }
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (!nconf.get('db')) {
    done(null, id);
  } else {
    const getDb = require('./lib/data');

    getDb((db) => {
      const userColl = db.collection('tenantUsers');
      userColl.findOne({ id }, done);
    });
  }
});

server.set('view engine', 'pug');
server.enable('trust proxy');

if (nconf.get('NODE_ENV') === 'production') {
  server.use((req, res, next) => {
    if (nconf.get('dontForceHttps') || req.originalUrl === '/test') return next();

    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(nconf.get('DOMAIN_URL_DOCS') + req.url);
    }

    return next();
  });
}

server.use('/test', (req, res) => {
  res.sendStatus(200);
});

server.use('/docs/test', (req, res) => {
  res.sendStatus(200);
});

if (nconf.get('NODE_ENV') !== 'test') {
  server.use(requestLogger);
}

server.use(cookieParser());
server.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(session({
  secret: nconf.get('sessionSecret'),
  store: sessionStore ? sessionStore(session) : undefined,
  key: nconf.get('COOKIE_NAME'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    domain: nconf.get('COOKIE_SCOPE'),
    path: '/',
    httpOnly: true,
    maxAge: null,
    secure: !nconf.get('dontForceHttps') && nconf.get('NODE_ENV') === 'production'
  }
}));

// security headers
server.use(cors);
server.use(helmet.hsts({ maxAge: 31536000000 }));
server.use(helmet.xssFilter());
server.use(helmet.noSniff());
server.use(helmet.hidePoweredBy());

// Only the quickstarts can be embedded in an iframe. We can't use helmet's frameguard
// middleware because it doesn't support exceptions on certain URLs.
// TODO: It would be nice if we could use the ALLOW FROM directive with the management
// site's URL, but it isn't supported in most browsers. Eventually we should consider
// setting a Content-Security-Policy header instead.
server.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/docs/quickstart')) {
    res.setHeader('X-Frame-Options', 'DENY');
  }
  next();
});

server.use(methodOverride());

server.use('/docs/media', express.static(path.join(__dirname, 'docs/media')));
['css', 'img', 'js', 'vendor'].forEach((folder) => {
  server.use(`/docs/${folder}`, express.static(path.join(__dirname, '/public/', folder)));
});


server.use(passport.initialize());
server.use(passport.session());
server.use(setCurrentTenant);
server.use(setUserIsOwner);
server.use(defaultValues);
server.use(setModeFlags);
server.use(overrideIfAuthenticated);
server.use(overrideClientQs);
server.use(overrideClientQsPublic);
server.use(docsVariables);
server.use(fetchABExperiments);
server.use(redirectQuickstarts);

// Routes
server.use('/docs', require('./lib/api-explorer/middleware'));
server.use('/docs/package', require('./lib/packager'));
server.use('/docs', require('./lib/feedback'));
server.use('/docs', require('./lib/sitemap'));
server.use('/docs', require('./lib/updates'));
server.use('/docs', require('./lib/redirects'));
server.use('/docs/meta', require('./lib/api'));
server.use('/docs', require('./lib/app'));
server.use('/docs', require('./lib/redirects/versioning'));

// This is just for localhost
server.get('/', (req, res) => {
  res.redirect('/docs');
});

// catch 404 and forward to error handler
server.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.use((internalErr, req, res, next) => {
  // Log server errors.
  if (internalErr.status > 499) {
    logger.error(internalErr);
  }

  // Create a santitized, serializable error that we can return to the client.
  const err = {
    status: internalErr.status || 500,
    title: internalErr.status === 404 ? strings.PAGE_NOT_FOUND : strings.ERROR_PROCESSING_REQUEST
  };

  // Don't send back stack traces in production.
  if (process.env.NODE_ENV === 'production') {
    err.message = err.title;
    err.stack = '';
  } else {
    err.message = internalErr.message;
    err.stack = internalErr.stack;
  }

  if (res.locals.embedded && req.headers['content-type'] === 'application/json') {
    res.type('json')
    .status(err.status)
    .json(err)
    .end();
  } else if (res.locals.embedded) {
    res.type('html')
    .status(err.status)
    .send(`<h1>${err.title}</h1><h2>${err.status}</h2><pre>${err.stack}</pre>`)
    .end();
  } else {
    bootstrap({ err }, req, res, next);
  }
});

server.use((err, req, res, next) => {
  // This is the worst-case scenario. If we've gotten here, the err page itself
  // encountered an error during rendering. If we're in production, show
  // error page; otherwise, dump the stack trace.
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500);
    res.render('error');
  } else {
    next(err);
  }
});

export default server;
