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

function unescape(html) {
  //console.log(html)
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
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
function md(text) {
  return marked(text, {
    renderer: renderer
  });
}


function compile(text) {
  text = md(text);
  text = mediaPath(text);
  text = relativePath(text);
  text = unescapeTemplates(text);
  //console.log(text);
  return lodash.template(text);
}

export default compile;
