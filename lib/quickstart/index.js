/**
 * Add quickstart collections for initialization
 * with server matching versioning for SEO and sitemap.xml
 */

import collections from '../collections/quickstarts';
import {prepareExternalData} from '../utils';
var debug = require('debug')('docs:quickstart');

function middleware(req, res, next) {
  if (!!res.locals.quickstart) return next();
  res.locals.quickstart = {};
  res.locals.quickstart.apptypes = prepareExternalData({}, collections.apptypes);
  res.locals.quickstart.clientPlatforms = prepareExternalData({}, collections.clientPlatforms);
  res.locals.quickstart.nativePlatforms = prepareExternalData({}, collections.nativePlatforms);
  res.locals.quickstart.hybridPlatforms = prepareExternalData({}, collections.hybridPlatforms);
  res.locals.quickstart.serverPlatforms = prepareExternalData({}, collections.serverPlatforms);
  res.locals.quickstart.serverApis = prepareExternalData({}, collections.serverApis);
  next();
}

/**
 * Expose routes mapping
 */

var routes = [];

collections.apptypes.forEach(apptypesComposer);

function apptypesComposer(application) {
  // Base apptype route
  var route = '/' + application.name;
  routes.push(route);
  debug('loaded route %s', route);

  // According to application's type
  // compose the rest of
  if ('webapp' === application.name) return collections.serverPlatforms.forEach(platformSingleComposer.bind(null, application));
  if ('spa' === application.name) return collections.clientPlatforms.forEach(platformApiComposer.bind(null, application));
  if ('hybrid' === application.name) return collections.hybridPlatforms.forEach(platformApiComposer.bind(null, application));
  if ('native-mobile' === application.name) return collections.nativePlatforms.forEach(platformApiComposer.bind(null, application));
}

function platformSingleComposer(application, platform) {
  var route = '/' + application.name + '/' + platform.name;
  routes.push(route);
  debug('loaded route %s', route);
}

function platformApiComposer(application, platform) {
  // Mid way route
  platformSingleComposer(application, platform);
  // No API route
  apiCombinedComposer(application, platform, { name: 'no-api' })
  // API combined route
  collections.serverApis.forEach(apiCombinedComposer.bind(null, application, platform));
}

function apiCombinedComposer(application, platform, api) {
  var route = '/' + application.name + '/' + platform.name + '/' + api.name;
  routes.push(route);
  debug('loaded route %s', route);
}

export { routes, middleware };
