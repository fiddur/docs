/** Used to match template delimiters. */
var reEscape = /&lt;%-([\s\S]+?)%&gt;/g,
  reEvaluate = /&lt;%([\s\S]+?)%&gt;/g,
  reInterpolate = /&lt;%=([\s\S]+?)%&gt;/g,
  reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  reEsLinkTemplate = /\$(\%7B)([^\\%7B]*(?:\\.[^\\%7B]*)*)(\%7D)/g,
  reEsTemplateWrapped = /<p\>(\$\{([^\\}]*(?:\\.[^\\}]*)*)\})<\/p\>/g;

function unescapeHtml(safe) {
  return safe.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, '\'')
      .replace(/&#39;/g, '\'')
      .replace(/<em>/g, '_')
      .replace(/<\/em>/g, '_');
}

function unescapeTemplate(text) {
  text = text.replace(reEscape, unescapeHtml);
  text = text.replace(reEvaluate, unescapeHtml);
  text = text.replace(reInterpolate, unescapeHtml);

  // Replaces es6 templates that were escaped in markdown links
  text = text.replace(reEsLinkTemplate, function(match, p1, p2) {
    return '${' + p2 + '}';
  });

  // Replaces es6 templates that were wrapped in <p>${}</p> blocks
  text = text.replace(reEsTemplateWrapped, function(match, p1) {
    return p1;
  });
  text = text.replace(reEsTemplate, unescapeHtml);
  return text;
}

export default function compiler(options) {
  return unescapeTemplate;
}
