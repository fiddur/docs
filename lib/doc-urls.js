/**
 * Module dependencies.
 */

var lsr = require('lsr');
var path = require('path');
var resolve = path.resolve;
var debug = require('debug')('docs:sitemap');
var nconf = require('nconf');

module.exports = (function() {
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
    if (!doc.isPublic()) return;;

    // skip if already on the list
    if (~urls.indexOf(doc.getUrl())) return;

    debug('adding %s', doc.getUrl());
    urls.push(doc.getUrl());
  });

  return urls;
})();
