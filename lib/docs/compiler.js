/**
 * Module dependencies.
 */

import lodash from 'lodash';
import nconf from 'nconf';
import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';

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

  return text.replace(/href="\//g, 'href="/docs/');
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
    return text.replace(/src="\/media\//g, 'src="/docs/media/');
  }
}

/** Used to match template delimiters. */
var reEscape = /&lt;%-([\s\S]+?)%&gt;/g,
  reEvaluate = /&lt;%([\s\S]+?)%&gt;/g,
  reInterpolate = /&lt;%=([\s\S]+?)%&gt;/g,
  reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  reEsLinkTemplate = /\$(\%7B)([^\\%7B]*(?:\\.[^\\%7B]*)*)(\%7D)/g;

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
  text = text.replace(reEsLinkTemplate, function(match, p1, p2, p3) {
    return '${' + p2 + '}';
  });
  text = text.replace(reEsTemplate, unescapeHtml);
  return text;
}

var markdown = markdownIt({
  html:         true,         // Enable HTML tags in source
  xhtmlOut:     true,         // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,        // autoconvert URL-like texts to links

  // Enable some language-neutral replacements + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externaly.
  // If result starts with <pre... internal wrapper is skipped.
  //
  // function (/*str, lang*/) { return ''; }
  //
  highlight: null,
  maxNesting:   20
});


const getAnchor = (token) => {
  return token.children
              .reduce((acc, t) => acc + t.content, '')
              .toLowerCase().replace(/[^\w]+/g, '-');
};

// Custom Rules
markdown.renderer.rules.table_open = function () { return '<table class="table">'; };

const originalHeadingOpen = markdown.renderer.rules.heading_open;
markdown.renderer.rules.heading_open = function(...args) {
  const [ tokens, idx, , env, self ] = args;

  env.headingIndex = env.headingIndex || 0;
  env.headingIndex++;

  var headingIndex = env.headingIndex;

  const attrs = tokens[idx].attrs = tokens[idx].attrs || [];
  const anchor = getAnchor(tokens[idx + 1]);
  attrs.push([ 'id', anchor ]);
  attrs.push([ 'class', 'anchor-heading' ]);


  var html;
  if (originalHeadingOpen) {
    html = originalHeadingOpen.apply(this, args);
  }
  else {
    html = self.renderToken(...args);
  }
  html += '<span id="' + headingIndex + '" class="anchor" href="#' + anchor + '">' +
            '<i class="icon icon-budicon-345"></i>' +
          '</span>';
  return html;
};

// Warning blockquotes
markdown.use(markdownItContainer, 'warning-banner', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<blockquote class="warning">';

    } else {
      // closing tag
      return '</blockquote>\n';
    }
  }
});

// Panel Containers
var panelGenerator = function(level) {
  var re = new RegExp('^panel-' + level + '\\s+(.*)$');
  return {
    validate: function(params) {
      return params.trim().match(re);
    },
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(re);
      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="panel panel-${level}">` +
                '<div class="panel-heading"><h3 class="panel-title">' +
                markdown.utils.escapeHtml(m[1]) +
                '</h3></div>' +
                '<div class="panel-body">';
      } else {
        // closing tag
        return '</div></div>\n';
      }
    }
  };
};


markdown.use(markdownItContainer, 'panel-primary', panelGenerator('primary'));
markdown.use(markdownItContainer, 'panel-success', panelGenerator('success'));
markdown.use(markdownItContainer, 'panel-info', panelGenerator('info'));
markdown.use(markdownItContainer, 'panel-warning', panelGenerator('warning'));
markdown.use(markdownItContainer, 'panel-danger', panelGenerator('danger'));

/**
 * Markdown processor
 *
 * @param {Object} context
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
function md(text) {
  return markdown.render(text);
}


export function comnpileTemplate(text) {
  text = md(text);
  text = mediaPath(text);
  text = relativePath(text);
  text = unescapeTemplates(text);
  return lodash.template(text);
}

export function makeLinksAbsolute(text) {
  var docsDomain = nconf.get('DOMAIN_URL_DOCS');
  docsDomain = docsDomain.replace('/docs', '');

  return text.replace(/href="\//g, `href="${docsDomain}/`)
    .replace(/src="(\/[^\/]+)/ig, `src="${docsDomain}$1`);
}