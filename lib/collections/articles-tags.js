/**
 * Module dependencies.
 */

import lsr from 'lsr';
import { resolve } from 'path';
import d from 'debug';
import nconf from 'nconf';
import Doc from '../docs/doc';

var debug = d('docs:sitemap');
var tags = {};

/**
 * List all /docs documents urls in sitemap
 * discarding the ones already in sitemap list
 */

var docspath = nconf.get('DOCS_PATH') || resolve(__dirname, '../../docs/articles');

function pathsFilter(relpath) {
  // avoid ./includes/ in sitemap.xml
  if (/^\.\/includes/.test(relpath)) {
    return false;
  }

  return true;
}

lsr
.sync(docspath, { filterPath: pathsFilter })
.forEach(function(fileStat) {
  var filepath = fileStat.path;

  // skip if not markdown document
  if (!/\.md$/.test(filepath)) return;

  var doc = new Doc(docspath, filepath);

  // skip if private document
  if (!doc.isPublic()) return;

  // skip if article:false
  if (doc.getMeta().article === false) return;

  debug('adding %s to articles', doc.getUrl());

  var obj = doc.getMeta();
  obj.url = doc.getUrl();

  var currentTags = doc.getMeta().tags;
  if (currentTags) {
    for (var i = 0; i < currentTags.length; i++) {
      var tag = currentTags[i];
      tags[tag] = tags[tag] || [];
      tags[tag].push(obj);
    }
  }
});

export default tags;

export function middleware(req, res, next) {
  res.locals.tags = tags;
  next();
}