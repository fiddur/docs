/**
 * Module dependencies.
 */

var path = require('path');
var resolve = path.resolve;
var nconf = require('nconf');
var markdownCollection = require('./markdown-collection');
var alternative_title = require('./utils').alternative_title;

var docspath = nconf.get('DOCS_PATH') || resolve(__dirname, '../docs/articles');
var articles = markdownCollection(docspath, function(doc) {
  var sections = doc.getSections();
  var title = doc.getMeta()['title'] || alternative_title(sections.content);

  var obj = doc.getMeta();
  obj.title = title;
  obj.url = doc.getUrl();

  // Remove metadata thta doesn't mean anything externally
  delete obj.lodash;

  return obj;
});

module.exports.articles = articles;

module.exports.middleware = function(req, res, next) {
  res.locals.articles = articles;
  next();
};
