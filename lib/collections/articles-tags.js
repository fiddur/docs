/**
 * Module dependencies.
 */

import memdocs from '../docs/memdocs';
import path from 'path';
import d from 'debug';
import Doc from '../docs/doc';

var debug = d('docs:sitemap');
var tags = {};

/**
 * List all /docs documents urls in sitemap
 * discarding the ones already in sitemap list
 */

var articlesPath = '/articles/';


memdocs.map(file => {

  // if (file.filename.indexOf('_includes') > -1 || path.basename(file.filename).indexOf('_') === 0) {
  //   this._meta.public = false;
  // }

  if (file.filename.indexOf(articlesPath) !== 0) return;

  // skip if not markdown document
  if (!/\.md$/.test(file.filename)) return;

  var filepath = file.filename.replace(articlesPath, '');

  var doc = new Doc(filepath, file.text);

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

// lsr
// .sync(articlesPath, { filterPath: pathsFilter })
// .forEach(function(fileStat) {
//   var filepath = fileStat.path;
//
//   // skip if not markdown document
//   if (!/\.md$/.test(filepath)) return;
//
//   var doc = new Doc(articlesPath, filepath);
//
//   // skip if private document
//   if (!doc.isPublic()) return;
//
//   // skip if article:false
//   if (doc.getMeta().article === false) return;
//
//   debug('adding %s to articles', doc.getUrl());
//
//   var obj = doc.getMeta();
//   obj.url = doc.getUrl();
//
//   var currentTags = doc.getMeta().tags;
//   if (currentTags) {
//     for (var i = 0; i < currentTags.length; i++) {
//       var tag = currentTags[i];
//       tags[tag] = tags[tag] || [];
//       tags[tag].push(obj);
//     }
//   }
// });

export default tags;

export function middleware(req, res, next) {
  res.locals.tags = tags;
  next();
}
