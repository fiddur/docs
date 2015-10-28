/**
 * Add quickstart collections for initialization
 * with server matching versioning for SEO and sitemap.xml
 */

import collections from '../collections/quickstarts';
var debug = require('debug')('docs:quickstart');

function middleware(req, res, next) {
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

/**
 * Expose routes mapping
 */

var routes = [];

function platformSingleComposer(application, platform) {
  var route = '/' + application.name + '/' + platform.name;
  routes.push(route);
  debug('loaded route %s', route);
}

function apiCombinedComposer(application, platform, api) {
  var route = '/' + application.name + '/' + platform.name + '/' + api.name;
  routes.push(route);
  debug('loaded route %s', route);
}

function platformApiComposer(application, platform) {
  // Mid way route
  platformSingleComposer(application, platform);
  // No API route
  apiCombinedComposer(application, platform, { name: 'no-api' });
  // API combined route
  collections.serverApis.forEach(apiCombinedComposer.bind(null, application, platform));
}

function appTypesComposer(application) {
  // Base apptype route
  var route = '/' + application.name;
  routes.push(route);
  debug('loaded route %s', route);

  // According to application's type compose the rest of
  if ('webapp' === application.name) {
    return collections.serverPlatforms.forEach(platformSingleComposer.bind(null, application));
  }

  if ('spa' === application.name) {
    return collections.clientPlatforms.forEach(platformApiComposer.bind(null, application));
  }

  if ('hybrid' === application.name) {
    return collections.hybridPlatforms.forEach(platformApiComposer.bind(null, application));
  }

  if ('native-mobile' === application.name) {
    return collections.nativePlatforms.forEach(platformApiComposer.bind(null, application));
  }

  if ('backend' === application.name) {
    return collections.serverApis.forEach(platformApiComposer.bind(null, application));
  }
}

collections.apptypes.forEach(appTypesComposer);




export { routes, middleware };
