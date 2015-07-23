/**
 * Module dependencies.
 */

var path = require('path');
var resolve = path.resolve;
var nconf = require('nconf');
var markdownCollection = require('./markdown-collection');

var docspath = nconf.get('SNIPPETS_PATH') || resolve(__dirname, '../docs/snippets');
var snippets = markdownCollection(docspath, function(doc) {
  var obj = doc.getMeta();
  obj.content = doc.getSections().content;

  // No url on this collection
  delete obj.url;

  return obj;
});

module.exports.snippets = snippets;

module.exports.middleware = function(req, res, next) {
  res.locals.snippets = snippets;
  res.locals.snippet = function(hash) {
    var snippet = snippets.findByHash(hash);
    if (snippet) {
      return snippet.content;
    }
  };
  next();
};
