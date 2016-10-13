import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import renderHttpSnippet from './renderHttpSnippet';
import unescapeTemplateTags from './unescapeTemplateTags';

const markdown = markdownIt({

  html: true,              // Enable HTML tags in source
  xhtmlOut: true,          // Use '/' to close single tags (<br />)
  breaks: false,           // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: false,          // autoconvert URL-like texts to links
  maxNesting: 20,

  // Enable some language-neutral replacements + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

  highlight: (str, lang) => {
    if (lang === 'har') {
      return renderHttpSnippet(markdown, str);
    }
    return '';
  }

});

const getAnchor = (token) => token.children
  .reduce((acc, t) => acc + t.content, '')
  .toLowerCase()
  .replace(/[^\w]+/g, '-');

/* --- Custom markdown rules --- */

markdown.renderer.rules.table_open = () => '<table class="table">';

const originalHeadingOpen = markdown.renderer.rules.heading_open;
markdown.renderer.rules.heading_open = (...args) => {
  const [tokens, idx, , env, self] = args;

  env.headingIndex = env.headingIndex || 0;
  env.headingIndex++;

  const headingIndex = env.headingIndex;

  const attrs = tokens[idx].attrs = tokens[idx].attrs || [];
  const anchor = getAnchor(tokens[idx + 1]);
  attrs.push(['id', anchor]);
  attrs.push(['class', 'anchor-heading']);

  let html;
  if (originalHeadingOpen) {
    html = originalHeadingOpen.apply(this, args);
  } else {
    html = self.renderToken(...args);
  }

  html += `<span id="${headingIndex}" class="anchor" href="#' + anchor + '">` +
            '<i class="icon icon-budicon-345"></i>' +
          '</span>';

  return html;
};

/* --- Warning blockquotes --- */

markdown.use(markdownItContainer, 'warning-banner', {
  render: (tokens, idx) => {
    // opening tag
    if (tokens[idx].nesting === 1) {
      return '<blockquote class="warning">';
    }

    return '</blockquote>\n';
  }
});

/* --- Panel containers --- */

const panelGenerator = (level) => {
  const re = new RegExp(`^panel-${level}\\s+(.*)$`);
  return {
    validate: (params) => params.trim().match(re),
    render: (tokens, idx) => {
      const match = tokens[idx].info.trim().match(re);
      // opening tag
      if (tokens[idx].nesting === 1) {
        return `<div class="panel panel-${level}">` +
                  '<div class="panel-heading">' +
                    `<h3 class="panel-title">${markdown.utils.escapeHtml(match[1])}</h3>` +
                  '</div>' +
                '<div class="panel-body">';
      }

      return '</div></div>\n';
    }
  };
};

markdown.use(markdownItContainer, 'panel-primary', panelGenerator('primary'));
markdown.use(markdownItContainer, 'panel-success', panelGenerator('success'));
markdown.use(markdownItContainer, 'panel-info', panelGenerator('info'));
markdown.use(markdownItContainer, 'panel-warning', panelGenerator('warning'));
markdown.use(markdownItContainer, 'panel-danger', panelGenerator('danger'));

export default function parseMarkdown(text) {
  return unescapeTemplateTags(markdown.render(text));
}
