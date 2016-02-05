import nconf from 'nconf';
import * as utils from '../utils';

var ALLOWED_ORIGINS = nconf.get('ALLOWED_ORIGINS');
var allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

export default function csp(req, res, next) {

  // Set default
  res.set({
    'X-Frame-Options': 'SAMEORIGIN'
  });

  var origin = `${req.protocol}://${req.hostname}`;
  var isOriginAllowed = allowedOrigins.some(function(o) {
    return utils.equalBaseUrls(o, origin);
  });

  if (isOriginAllowed) {
    res.set({
      'X-Frame-Options': `ALLOW-FROM ${origin}`,
    });
  }

  next();
}
