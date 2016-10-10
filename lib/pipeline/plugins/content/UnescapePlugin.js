class UnescapePlugin {

  constructor(options = {}) {
    this.regexps = {
      escape: options.escape || UnescapePlugin.defaults.escape,
      evaluate: options.evaluate || UnescapePlugin.defaults.evaluate,
      interpolate: options.interpolate || UnescapePlugin.defaults.interpolate,
      esLinkTemplate: options.esLinkTemplate || UnescapePlugin.defaults.esLinkTemplate,
      esTemplateWrapped: options.esTemplateWrapped || UnescapePlugin.defaults.esTemplateWrapped,
      esTemplate: options.esTemplate || UnescapePlugin.defaults.esTemplate
    };
  }

  transform(meta, content) {
    let transformed = content;

    transformed = transformed.replace(this.regexps.escape, this.unescapeHtml);
    transformed = transformed.replace(this.regexps.evaluate, this.unescapeHtml);
    transformed = transformed.replace(this.regexps.interpolate, this.unescapeHtml);

    // Replaces es6 templates that were escaped in markdown links
    transformed = transformed.replace(this.regexps.esLinkTemplate, (match, p1, p2) => `\${${p2}}`);

    // Replaces es6 templates that were wrapped in <p>${}</p> blocks
    transformed = transformed.replace(this.regexps.esTemplateWrapped, (match, p1) => p1);

    transformed = transformed.replace(this.regexps.esTemplate, this.unescapeHtml);

    return transformed;
  }

  unescapeHtml(safe) {
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

}

UnescapePlugin.defaults = {
  escape: /&lt;%-([\s\S]+?)%&gt;/g,
  evaluate: /&lt;%([\s\S]+?)%&gt;/g,
  interpolate: /&lt;%=([\s\S]+?)%&gt;/g,
  esTemplate: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  esLinkTemplate: /\$(%7B)([^\\%7B]*(?:\\.[^\\%7B]*)*)(%7D)/g,
  esTemplateWrapped: /<p>(\$\{([^\\}]*(?:\\.[^\\}]*)*)\})<\/p>/g
};

export default UnescapePlugin;
