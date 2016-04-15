/**
 * Module dependencies.
 */

import { resolve } from 'path';
import nconf from 'nconf';
import markdownCollection from './markdown-collection';

var snippetsPath = '/snippets/';
var snippets = markdownCollection(snippetsPath, function(doc) {
  var obj = doc.getMeta();
  obj.content = doc.getSections().content;

  // No url on this collection
  delete obj.url;

  return obj;
});

export default snippets;
