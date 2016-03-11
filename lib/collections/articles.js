/**
 * Module dependencies.
 */

import markdownCollection from './markdown-collection';

var articlesPath =  '/articles/';
var articles = markdownCollection(articlesPath, function(doc) {
  var title = doc.getMeta()['title'];

  var obj = doc.getMeta();
  obj.title = title;
  obj.url = doc.getUrl();

  return obj;
});

export default articles;

export function middleware(req, res, next) {
  res.locals.articles = articles;
  next();
}
