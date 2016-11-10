import assert from 'assert';

/**
 * Uses the UrlFormatter to normalize URLs in HTML attributes (href and src).
 */
class NormalizeContentUrlsPlugin {

  /**
   * Creates an instance of NormalizeContentUrlsPlugin.
   * @param {Object} options - An options hash.
   * @param {UrlFormatter} options.urlFormatter - The UrlFormatter instance to use.
   * @param {RegExp} [options.regex] - The regular expression to use to match attributes.
   */
  constructor(options = {}) {
    assert(options.urlFormatter, 'NormalizeContentUrlsPlugin requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
    this.regex = options.regex || NormalizeContentUrlsPlugin.defaults.regex;
  }

  /**
   * Transforms the specified content, normalizing the URLs for any attributes matching
   * the regular expression.
   * @param {Document} doc - The document being processed.
   * @param {String} content - The current content for the document.
   * @returns {String} The (potentially-transformed) content for the document.
   */
  postprocess(doc, content) {
    return content.replace(this.regex, (match, attr, url) =>
      `${attr}="${this.urlFormatter.format(url)}"`
    );
  }

}

NormalizeContentUrlsPlugin.defaults = {
  regex: /(href|src)="([\s\S]+?)"/g
};

export default NormalizeContentUrlsPlugin;
