import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import HTTPSnippet from 'httpsnippet';
import uuid from 'node-uuid';
import fs from 'fs';
import path from 'path';
import lodash from 'lodash';
import sizeOf from 'image-size';
import winston from 'winston';

var httpSnippetHtml = fs.readFileSync(__dirname + '/http-snippet.html');
var httpSnippetTemplate = lodash.template(httpSnippetHtml);

const httpTargets = [
  { key: 'shell', title: 'cURL', css: 'text' },
  { key: 'csharp', title: 'C#', css: 'csharp' },
  { key: 'go', title: 'Go', css: 'go' },
  { key: 'java', title: 'Java', css: 'java' },
  { key: 'javascript', type: 'jquery', title: 'jQuery', css: 'javascript' },
  { key: 'node', type: 'request', title: 'Node.JS', css: 'javascript' },
  { key: 'objc', title: 'Obj-C', css: 'objective-c' },
  { key: 'php', title: 'PHP', css: 'php' , options: { noTags: true }},
  { key: 'python', title: 'Python', css: 'python' },
  { key: 'ruby', title: 'Ruby', css: 'ruby' },
  { key: 'swift', title: 'Swift', css: 'swift' }
];

function markdownCompiler(options) {
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
    highlight: function(str, lang) {
      if (lang === 'har') {
        var har;
        try {
          har = JSON.parse(str);
        } catch (ex) {
          throw new Error('Invalid JSON in HAR snippet.');
        }

        if (!har) {
          throw new Error('Empty HAR value.');
        }

        try {
          var snippet = new HTTPSnippet(har);
          var snippets = [];
          httpTargets.map(target => {
            var code = snippet.convert(target.key, target.type, target.options || {});
            code = code.replace(/https\:\/\/\//g, 'https://'); // Some random encoding issue. ¯\_(ツ)_/¯
            code = markdown.utils.escapeHtml(code);
            snippets.push({
              key: target.key,
              title: target.title,
              css: target.css,
              code: code
            });
          });
          return httpSnippetTemplate({ id: uuid.v4().replace(/\-/g, ''), snippets: snippets });
        } catch (ex) {
          throw new Error('Error compiling HAR snippet.');
        }
      } else {
        return ''; // use normal escaping
      }
    },
    maxNesting:   20
  });


  // Custom Rules
  markdown.renderer.rules.table_open = function () { return '<table class="table">'; };

  const getAnchor = (token) => {
    return token.children
                .reduce((acc, t) => acc + t.content, '')
                .toLowerCase().replace(/[^\w]+/g, '-');
  };

  if (!options.isAmp) {

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
  }

  if (options.isAmp) {

    markdown.renderer.rules.image = function(...args) {
      const [ tokens, idx, , env, self ] = args;

      var token = tokens[idx];
      var aIndex = token.attrIndex('src');
      var src = token.attrs[aIndex][1];

      var dimensions;

      if (src.indexOf('/media/') === 0) {
        var fPath = path.join(__dirname, '../../../docs', src);
        try {
          dimensions = sizeOf(fPath);
        } catch(err) {
          // Swollow this error on purpose
          winston.warn(`Cannot locate image at "${fPath}"`);
        }
      } else {
        winston.warn(`Image hosted outside of repository at "${src}"`);
      }

      var attrs = '';
      if (dimensions) {
        attrs = `width="${dimensions.width}" height="${dimensions.height}"`;
      }

      return `<amp-img src="${src}" ${attrs}></amp-img>`;
    }

  }

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

  return (text) => {
    return markdown.render(text);
  }
}

export default function compiler(options) {
  if (options.isMarkdown) {
    return markdownCompiler(options);
  } else {
    // No op
    return (text) => { return text; }
  }
}
