/**
 * Module dependencies.
 */

import { resolve, join } from 'path';
import nconf from 'nconf';
import markdownCollection from './markdown-collection';
import { forEach, extend, merge, clone } from 'lodash';

var landingPath = nconf.get('LANDINGS_PATH') || resolve(__dirname, '../../docs/landings');
var modulesPath = join(landingPath, 'modules');
var modules = markdownCollection(modulesPath, function(doc) {

  var meta = doc.getMeta();
  var content = doc.getSections().content;

  meta.content = content() || meta.content;
  delete meta.url;

  return meta;
});

var landings = markdownCollection(landingPath, function(doc) {
  var obj = doc.getMeta();

  expand(obj);

  obj.content = doc.getSections().content;
  obj.modules = obj.modules;

  // No url on this collection
  delete obj.url;

  return obj;
});

function expand(landingPages) {
  forEach(landingPages.pages, function(pageDescriptor) {
    if (pageDescriptor.banner && pageDescriptor.banner.module) {
      pageDescriptor.banner.module = expandModule(pageDescriptor.banner.module);
    }

    pageDescriptor.modules = expandModules(pageDescriptor.modules);
  });
}

function expandModules(moduleNames) {
  return moduleNames.map(expandModule);
}

function expandModule(name) {
  return modules.findByHash(name);
}

export default landings;

export function middleware(req, res, next) {
  res.locals.landings = landings;
  res.locals.landing = function(hash) {
    var landing = landings.findByHash(hash);
    if (landing) {
      return landing.content(res.locals);
    }
  };
  next();
}
