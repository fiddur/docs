/**
 * Module dependencies.
 */

import markdownCollection from './markdown-collection';

var articlesPath =  '/articles/';
var articles = markdownCollection(articlesPath, function(doc) {
  var obj = doc.getMeta();
  obj.url = doc.getUrl();
  return obj;
});

export default articles;
