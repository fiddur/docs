/**
 * Module dependencies.
 */

import lsr from 'lsr';
import path from 'path';
import d from 'debug';
import nconf from 'nconf';

var debug = d('docs:sitemap');
var resolve = path.resolve;

var urls = [];


/**
 * List all /docs documents urls in sitemap
 * discarding the ones already in sitemap list
 */

var docspath = nconf.get('DOCS_PATH') || resolve(__dirname, '../docs/articles');
var Doc = require('markdocs/lib/markdocs/doc');
var mockapp = {
  getDocsPath: function() {
    return docspath;
  }
};

function pathsFilter(relpath) {
  // avoid ./includes/ in sitemap.xml
  if (/^\.\/includes/.test(relpath)) {
    return false;
  }

  return true;
}

lsr
  .sync(docspath, {
    filterPath: pathsFilter
  })
  .forEach(function(fileStat) {
    var filepath = fileStat.path;

    // skip if not markdown document
    if (!/\.md$/.test(filepath)) return;

    var doc = new Doc(mockapp, filepath);

    // skip if private document
    if (!doc.isPublic()) return;

    // skip if already on the list
    if (~urls.indexOf(doc.getUrl())) return;

    if (null != doc._meta.sitemap && !doc._meta.sitemap) return;

    debug('adding %s', doc.getUrl());
    urls.push(doc.getUrl());
  });

export default urls;
