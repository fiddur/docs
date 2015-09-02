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

function is_parsing_an_include() {
  var err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

/**
 * Relative path processor
 *
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
var relativePath = function(text) {
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
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
function mediaPath(text) {
  if (nconf.get('MEDIA_URL')) {
    return text.replace(/src="\/media\//g, 'src="' + nconf.get('MEDIA_URL') + '/');
  } else {
    return text;
  }
}

/** Used to match template delimiters. */
var reEscape = /&lt;%-([\s\S]+?)%&gt;/g,
    reEvaluate = /&lt;%([\s\S]+?)%&gt;/g,
    reInterpolate = /&lt;%=([\s\S]+?)%&gt;/g,
    reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

function unescapeHtml(safe) {
  //console.log(safe);
    return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, '\'')
        .replace(/&#39;/g, '\'')
        .replace(/<em>/g, '_')
        .replace(/<\/em>/g, '_');
}

function unescapeTemplates(text) {
  text = text.replace(reEscape, unescapeHtml);
  text = text.replace(reEvaluate, unescapeHtml);
  text = text.replace(reInterpolate, unescapeHtml);
  text = text.replace(reEsTemplate, unescapeHtml);
  return text;
}

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
    return `<blockquote class="warning">\n<p>${quote.substring(4)}</blockquote>\n`;
  } else {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }
};


renderer.heading = function(text, level, raw) {
  var headingIndex = this.options.headingIndex;
  this.options.headingIndex++;

  // The second h is added here with id=headingIndex to maintain backward compat with old links
  return `<h${level} id="${this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')}">${text}</h${level}>
<h${level} id="${headingIndex}"></h${level}>
<a class="anchor" href="#${this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-')}}"><i class="icon icon-budicon-345"></i></a>\n`;
};

/**
 * Markdown processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
function md(text) {
  return marked(text, {
    renderer: renderer,
    headingIndex: 1 // This simply sets the index at 1 to use in the renderer
  });
}


function compile(text) {
  text = md(text);
  text = mediaPath(text);
  text = relativePath(text);
  text = unescapeTemplates(text);
  return lodash.template(text);
}

export default compile;
