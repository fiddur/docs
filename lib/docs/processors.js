/**
 * Module dependencies.
 */

import lodash from 'lodash';
import nconf from 'nconf';

/**
 * Add mixins
 */
lodash.mixin({
  capitalize: function(string) {
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

var lodashProcessor = function(context, text) {
  return lodash.template(text)(context);
};

function is_parsing_an_include() {
  var err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

/**
 * Relative path processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
var relativePath = function(context, text) {
  if (is_parsing_an_include()) {
    return text;
  }

  return text.replace(/href="\//g, 'href="' + nconf.get('BASE_URL') + '/')
    .replace(/src="(\/[^\/]+)/ig, 'src="' + nconf.get('BASE_URL') + '$1')
    .replace('BASE_URL = "/"', 'BASE_URL = "' + nconf.get('BASE_URL') + '"');
};

/**
 * Media path processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
var mediaPath = function(context, text) {
  if (nconf.get('MEDIA_URL')) {
    return text.replace(/src="\/media\//g, 'src="' + nconf.get('MEDIA_URL') + '/');
  } else {
    return text;
  }
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
function mdProcessor(context, text) {
  return marked(text, {
    renderer: renderer
  });
}


var processors = [lodashProcessor, mdProcessor, mediaPath, relativePath];

export {
  mdProcessor,
  lodashProcessor,
  processors
};
