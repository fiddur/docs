/**
 * Module dependencies.
 */

var lsr = require('lsr');
var fs = require('fs');
var path = require('path');
var resolve = path.resolve;
var debug = require('debug')('docs:sitemap');
var nconf = require('nconf');
var alternative_title = require('./utils').alternative_title;
var _ = require('lodash');

var articles = {
  items: []
};

articles.findByHash = function(hash) {
  var parts = hash.split('.');
  var current = articles;
  for (var i = 0; i < parts.length; i++) {
    current = _.find(current.items, { hash: parts[i] });
  }
  return current;
}

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

var buildTree = function(current, path) {
  var paths = fs.readdirSync(path);
  for (var i = 0; i < paths.length; i++) {
    var resolvedPath = resolve(path, paths[i]);
    var stats = fs.statSync(resolvedPath);
    if (stats.isDirectory()) {
      var item = {
        url: (current.url || '') + '/' + paths[i],
        hash: paths[i],
        items: []
      };
      current.items.push(item);
      buildTree(item, resolvedPath);
    }
  }
}
buildTree(articles, docspath);

lsr
.sync(docspath)
.forEach(function(fileStat) {
  var filepath = fileStat.path;

  var parts = filepath.substring(2).replace('.md', '').split('/');

  var current = articles;
  for (var i = 0; i < parts.length - 1; i++) {
    var next = _.find(current.items, { hash: parts[i] });
    if (!next) {
      next = {
        hash: parts[i],
        url: parts.join('/'),
        items: []
      };

      current.items.push(next);
    }
    current = next;
  }

  // skip non-markdown files
  if (!/\.md$/.test(filepath)) return;

  var doc = new Doc(mockapp, filepath);

  // skip if private document
  if (!doc.isPublic()) return;

  debug('adding %s to articles', doc.getUrl());

  var sections = doc.getSections();
  var title = doc.getMeta()['title'] || alternative_title(sections.content);

  var obj = doc.getMeta();
  obj.title = title;
  obj.hash = obj.hash || parts[parts.length-1];
  obj.url = doc.getUrl();

  // Remove metadata thta doesn't mean anything externally
  delete obj.lodash;

  if (obj.hash === 'index') {
    delete obj.hash;
    _.merge(current, obj);
  } else {
    current.items.push(obj);
  }

});

module.exports.articles = articles;



module.exports.middleware = function(req, res, next) {
  res.locals.articles = articles;
  next();
}
