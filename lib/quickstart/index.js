/**
 * Add quickstart collections for initialization
 * with server matching versioning for SEO and sitemap.xml
 */

import collections from '../collections/quickstarts';
var debug = require('debug')('docs:quickstart');

/**
 * Expose routes mapping
 */

var routes = [];

function platformComposer(application, platform) {
  var route = '/' + application.name + '/' + platform.name;
  routes.push(route);
  debug('loaded route %s', route);
}

function appTypesComposer(application) {
  // Base apptype route
  var route = '/' + application.name;
  routes.push(route);
  debug('loaded route %s', route);

  // According to application's type compose the rest of the routes
  if ('native' === application.name) {
    return collections.nativePlatforms.forEach(platformComposer.bind(null, application));
  }

  if ('web' === application.name) {
    return collections.webPlatforms.forEach(platformComposer.bind(null, application));
  }

  if ('service' === application.name) {
    return collections.servicePlatforms.forEach(platformComposer.bind(null, application));
  }
}

collections.appTypes.forEach(appTypesComposer);

export default collections;
export { routes };
