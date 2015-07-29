/**
 * Module dependencies.
 */

import { resolve } from 'path';
import nconf from 'nconf';
import markdownCollection from './markdown-collection';
import { alternative_title } from '../utils';

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

export default articles;

export function middleware(req, res, next) {
  res.locals.articles = articles;
  next();
}
