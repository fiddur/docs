const REGEXPS = {
  escape: /&lt;%-([\s\S]+?)%&gt;/g,
  evaluate: /&lt;%([\s\S]+?)%&gt;/g,
  interpolate: /&lt;%=([\s\S]+?)%&gt;/g,
  esTemplate: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  esLinkTemplate: /\$(%7B)([^\\%7B]*(?:\\.[^\\%7B]*)*)(%7D)/g,
  esTemplateWrapped: /<p>(\$\{([^\\}]*(?:\\.[^\\}]*)*)\})<\/p>/g
};

function unescapeHtml(safe) {
  return safe
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, '\'')
  .replace(/&#39;/g, '\'')
  .replace(/<em>/g, '_')
  .replace(/<\/em>/g, '_');
}

class UnescapePlugin {

  transform(meta, content) {
    let transformed = content.replace(REGEXPS.escape, unescapeHtml);
    transformed = transformed.replace(REGEXPS.evaluate, unescapeHtml);
    transformed = transformed.replace(REGEXPS.interpolate, unescapeHtml);

    // Replaces es6 templates that were escaped in markdown links
    transformed = transformed.replace(REGEXPS.esLinkTemplate, (match, p1, p2) => `\${${p2}}`);

    // Replaces es6 templates that were wrapped in <p>${}</p> blocks
    transformed = transformed.replace(REGEXPS.esTemplateWrapped, (match, p1) => p1);

    transformed = transformed.replace(REGEXPS.esTemplate, unescapeHtml);

    return transformed;
  }

}

export default UnescapePlugin;
