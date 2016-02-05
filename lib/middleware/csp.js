import nconf from 'nconf';

var ALLOWED_ORIGINS = nconf.get('ALLOWED_ORIGINS');
var allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [];

export default function csp(req, res, next) {

  // Set defaults
  res.set({
    'Content-Security-Policy': `frame-ancestors 'self' ${allowedOrigins.join(' ')}`
  });

  next();
}
