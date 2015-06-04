/**
 * Module dependencies.
 */

var lodash = require('lodash');
var nconf = require('nconf');

/**
* Add mixins
*/
lodash.mixin({
  capitalize : function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
});

/**
 * Expose extensions
 */

/**
 * Lodash Pre-compile extension
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */

exports.lodash = function(context, text) {
  return context.meta.lodash
    ? lodash.template(text)(context)
    : text;
}

/**
 * Relative path processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
exports.relativePath = function(context, text) {
  return text.replace(/href="\//g, 'href="' + nconf.get('BASE_URL') + '/')
            .replace(/src="(\/[^\/]+)/ig, 'src="' + nconf.get('BASE_URL') + '$1')
            .replace('BASE_URL = "/"', 'BASE_URL = "' + nconf.get('BASE_URL') + '"');
}

/**
 * Media path processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
exports.mediaPath = function(context, text) {
    return text.replace(/src="\/media\//g, 'src="' + nconf.get('MEDIA_URL') + '/');
};



var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

var renderer = new marked.Renderer();

// Warning blockquotes
// >! My Warning Here
renderer.blockquote = function(quote) {
  if (quote.indexOf('<p>!') === 0) {
    return '<blockquote class="warning">\n' + '<p>' + quote.substring(4) + '</blockquote>\n';
  } else {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }
};

/**
 * Markdown processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
exports.markdown = function(context, text) {
  return marked(text, { renderer: renderer });
}
