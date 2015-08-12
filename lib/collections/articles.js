/**
 * Module dependencies.
 */

import { resolve } from 'path';
import nconf from 'nconf';
import markdownCollection from './markdown-collection';

var docspath = nconf.get('DOCS_PATH') || resolve(__dirname, '../docs/articles');
var articles = markdownCollection(docspath, function(doc) {
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
