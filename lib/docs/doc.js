/**
 * Module dependencies.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import compiler from './compiler';

/**
 * Matches an alternative
 * title require(the content
 *
 * @param {String} content
 * @return {String} title
 * @api private
 */

function alternativeTitle(content) {
  var regex = /\#{1}[^\n\#]+/g;
  var match = content.match(regex);

  if (match && match.length) match = match[0].slice(1).trim();

  return match || 'Document';
}

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

  // Check if the doc is an include
  if (filepath.indexOf('_includes') > -1 || path.basename(filepath).indexOf('_') === 0) {
    this._meta.public = false;
  }

  if (!this._meta.url) {
    this._meta.url = '/' + this._filename.replace(/\.[\w]+$/, '');
  }

  if (!this._meta.title) {
    this._meta.title = alternativeTitle(content);
  }

  //TODO: implement section files
  var template = compiler(content);
  this._sections = { 'content': template };

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
    var template = this._sections[sname];
    sections[sname] = template(context);
  }
  return sections;
};

export default Doc;
