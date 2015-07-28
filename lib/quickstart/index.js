/**
 * Add quickstart collections for initialization
 * with server matching versioning for SEO and sitemap.xml
 */

var collections = require('../quickstart-collections');

export function middleware(req, res, next) {
  if (!!res.locals.quickstart) return next();
  res.locals.quickstart = {};
  res.locals.quickstart.apptypes = collections.apptypes;
  res.locals.quickstart.clientPlatforms = collections.clientPlatforms;
  res.locals.quickstart.nativePlatforms = collections.nativePlatforms;
  res.locals.quickstart.hybridPlatforms = collections.hybridPlatforms;
  res.locals.quickstart.serverPlatforms = collections.serverPlatforms;
  res.locals.quickstart.serverApis = collections.serverApis;
  next();
}
