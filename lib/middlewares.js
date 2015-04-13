var winston = require('winston');
var nconf = require('nconf');
var utils = require('./utils');

/**
 * Parse `configuration` local from `query` parameters
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @api public
 */

function configurationMiddleware (req, res, next) {
  // used by lodash extension
  var configuration = res.locals.configuration = res.locals.configuration || {};

  // common data
  configuration.frontend = req.query.frontend || null;
  configuration.api = req.query.api || null;
  configuration.backend = req.query.backend || null;
  configuration.mobile = req.query.mobile || null;
  // combination data
  configuration.thirdParty = req.query['3rd'] || req.query.thirdparty || req.query.thirdpParty || false;
  configuration.hybrid = req.query.hybrid || false;
  next();
}

var ALLOWED_ORIGINS = nconf.get('ALLOWED_ORIGINS');
var allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

function cors (req, res, next){
  if (!(allowedOrigins.length && req.headers.origin)) {
    return next();
  }

  // ignore if origin === host
  var host = (req.headers['x-forwarded-proto'] || req.protocol) + '://' + req.headers.host;

  if (req.headers.origin === host) {
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    });

    return next();
  }

  var isOriginAllowed = allowedOrigins.some(function (o) {
    return utils.equalBaseUrls(o, req.headers.origin);
  });

  if (isOriginAllowed){
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    });
  }

  next();
}

/**
 * Expose middlewares
 */

exports.configuration = configurationMiddleware;
exports.cors = cors;
