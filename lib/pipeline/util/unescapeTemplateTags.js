const REGEXPS = {
  escape: /&lt;%-([\s\S]+?)%&gt;/g,
  evaluate: /&lt;%([\s\S]+?)%&gt;/g,
  interpolate: /&lt;%=([\s\S]+?)%&gt;/g,
  esTemplate: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  esLinkTemplate: /\$(%7B)([^\\%7B]*(?:\\.[^\\%7B]*)*)(%7D)/g,
  esTemplateWrapped: /<p>(\$\{([^\\}]*(?:\\.[^\\}]*)*)\})<\/p>/g
};

const unescape = (html) => (
  html
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, '\'')
  .replace(/&#39;/g, '\'')
  .replace(/<em>/g, '_')
  .replace(/<\/em>/g, '_')
);

export default function unescapeTemplateTags(text) {
  let result = text;

  result = result.replace(REGEXPS.escape, unescape);
  result = result.replace(REGEXPS.evaluate, unescape);
  result = result.replace(REGEXPS.interpolate, unescape);

  // Replaces es6 templates that were escaped in markdown links
  result = result.replace(REGEXPS.esLinkTemplate, (match, p1, p2) => `\${${p2}}`);

  // Replaces es6 templates that were wrapped in <p>${}</p> blocks
  result = result.replace(REGEXPS.esTemplateWrapped, (match, p1) => p1);

  result = result.replace(REGEXPS.esTemplate, unescape);

  return result;
}
