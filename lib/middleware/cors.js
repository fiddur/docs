import nconf from 'nconf';
import * as utils from '../utils';

var ALLOWED_ORIGINS = nconf.get('ALLOWED_ORIGINS');
var allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

export default function cors(req, res, next) {
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

  var isOriginAllowed = allowedOrigins.some(function(o) {
    return utils.equalBaseUrls(o, req.headers.origin);
  });

  if (isOriginAllowed) {
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    });
  }

  next();
}
