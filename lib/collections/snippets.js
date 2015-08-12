/**
 * Module dependencies.
 */

import { resolve } from 'path';
import nconf from 'nconf';
import markdownCollection from './markdown-collection';

var docspath = nconf.get('SNIPPETS_PATH') || resolve(__dirname, '../../docs/snippets');
var snippets = markdownCollection(docspath, function(doc) {
  var obj = doc.getMeta();
  obj.content = doc.getSections().content;

  // No url on this collection
  delete obj.url;

  return obj;
});

export default snippets;

export function middleware(req, res, next) {
  res.locals.snippets = snippets;
  res.locals.snippet = function(hash) {
    var snippet = snippets.findByHash(hash);
    if (snippet) {
      return snippet.content(res.locals);
    }
  };
  next();
}
