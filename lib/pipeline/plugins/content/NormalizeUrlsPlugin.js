import assert from 'assert';

class NormalizeUrlsPlugin {

  constructor(options = {}) {
    assert(options.urlFormatter, 'NormalizeUrlsPlugin requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
    this.regex = options.regex || NormalizeUrlsPlugin.defaults.regex;
  }

  transform(doc, content) {
    return content.replace(this.regex, (match, attr, url) =>
      `${attr}="${this.urlFormatter.format(url)}"`
    );
  }

}

NormalizeUrlsPlugin.defaults = {
  regex: /(href|src)="([\s\S]+?)"/g
};

export default NormalizeUrlsPlugin;
