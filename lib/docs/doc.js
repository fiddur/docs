/**
 * Module dependencies.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { processors } from './processors';

/**
 * Parse metadata from `Document` content
 *
 * ---
 * title: Title
 * url: /
 * ---
 *
 * #Title
 * More content
*/

/**
 * Compile a `Document` from `filename` for `app`
 * Resolve `metadata` and some other perls
 *
 * @param {Markdocs} app
 * @param {String} filename
 */

function Doc(docsPath, filename){

  var filepath = path.resolve(docsPath, filename);
  var data = matter(fs.readFileSync(filepath, 'utf8'));

  this._filename = path.normalize(filename);

  this._meta = data.data || {};
  var content = data.content || '';

  if (filepath.indexOf('_includes') > -1) {
    this._meta.public = false;
  }

  if (!this._meta.url) {
    this._meta.url = '/' + this._filename.replace(/\.[\w]+$/, '');
  }

  //TODO: implement section files
  this._sections = { 'content': content };

}

/**
 * Get `Document` url from `_meta`
 *
 * @return {String}
 * @api public
 */

Doc.prototype.getUrl = function() {
  return this._meta.url;
};

/**
 * Falsey if `Document` is not `public`
 *
 * @return {Boolean}
 * @api public
 */

Doc.prototype.isPublic = function() {
  return this._meta.public !== false;
};

/**
 * Get current `Metadata`
 *
 * @return {Object}
 * @api public
 */

Doc.prototype.getMeta = function() {
  return this._meta;
};

/**
 * Get `Document`'s `filename`
 *
 * @return {String}
 * @api public
 */

Doc.prototype.getFilename = function() {
  return this._filename;
};

/**
 * Get `Document`'s `sections`
 *
 * @return {Object}
 * @api public
 */

Doc.prototype.getSections = function() {
  return this._sections;
};

/**
 * Process `sections` from `context`
 *
 * @param {Context} context
 * @return {Object}
 * @api public
 */

Doc.prototype.processSections = function(context) {
  var sections = {};

  for(var sname in this._sections) {
    var text = this._sections[sname];
    for (var p in processors) {
      if (typeof processors[p] === 'function') {
        text = processors[p](context, text);
      }
    }
    sections[sname] = text;
  }
  return sections;
};

export default Doc;
