var winston    = require('winston');
var onFinished = require('on-finished');
var crypto     = require('crypto');
var cb         = require('cb');
var _          = require('lodash');
var nconf      = require('nconf');

var ignored_routes = ['/test'];

module.exports = function (req, res, next) {
  if (~ignored_routes.indexOf(req.path)) {
    return next();
  }

  var start = new Date();

  req._tracking_id = crypto.randomBytes(10).toString('hex');

  //this append the minimal information to reference the request
  req.log_event = function (data) {
    return _.extend({}, data, {
      req: req
    });
  };

  if (nconf.get('NODE_ENV') === 'production') {
    //since a response object is *always* logged for every request
    //this is only debug log
    winston.debug('request', req.log_event({
      log_type: 'request',
    }));
  }

  onFinished(res, cb(function (err) {

    res._time = new Date() - start;

    winston.info('response', req.log_event({
      log_type: 'response',
      res:      res,
      err:      err
    }));

  }).timeout(30 * 1000).once());

  next();
};