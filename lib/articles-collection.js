/**
 * Module dependencies.
 */

var lsr = require('lsr');
var path = require('path');
var resolve = path.resolve;
var debug = require('debug')('docs:sitemap');
var nconf = require('nconf');

var articles = {};

/**
 * List all /docs documents urls in sitemap
 * discarding the ones already in sitemap list
 */

var docspath = nconf.get('DOCS_PATH') || resolve(__dirname, '../../docs/articles');
var Doc = require('markdocs/lib/markdocs/doc');
var mockapp = {
  getDocsPath: function() {
    return docspath;
  }
};

function pathsFilter(relpath) {
  // avoid ./includes/ in sitemap.xml
  if (/^\.\/includes/.test(relpath)) {
    return false
  };

  return true;
}

lsr
.sync(docspath, { filterPath: pathsFilter })
.forEach(function(fileStat) {
  var filepath = fileStat.path;

  // skip if not markdown document
  if (!/\.md$/.test(filepath)) return;

  var doc = new Doc(mockapp, filepath);

  // skip if private document
  if (!doc.isPublic()) return;

  // skip if article:false
  if (doc.getMeta().article === 'false') return;

  debug('adding %s to articles', doc.getUrl());

  var parts = filepath.substring(2).replace('.md', '').split('/');

  var current = articles;
  for (var i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]]  = current[parts[i]] || {};
  }

  var obj = doc.getMeta();
  obj.url = doc.getUrl();

  current[parts[parts.length - 1]] = obj;
});

module.exports = function(req, res, next) {
  res.locals.articles = articles;
  next();
}
