import assert from 'assert';
import { merge } from 'lodash';

/**
 * Normalizes the URLs within a Document's metadata.
 */
class NormalizeUrlsPlugin {

  /**
   * Creates an instance of NormalizeUrlsPlugin.
   * @param {Object} options - An options hash.
   * @param {UrlFormatter} options.urlFormatter - The UrlFormatter instance to use.
   * @param {RegExp} documentPathRegex - A regular expression describing the root path for articles.
   */
  constructor(options = {}) {
    assert(options.urlFormatter, 'NormalizeUrlsPlugin constructor requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
    this.documentPathRegex = options.documentPathRegex || NormalizeUrlsPlugin.defaults.documentPathRegex;
  }

  /**
   * Normalize the Document's URL. If it doesn't already have one, first generate
   * one using its path.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    const patch = {};

    const url = doc.url || doc.path.replace(this.documentPathRegex, '');
    patch.url = this.urlFormatter.format(url);

    // If the Document has an image property, format it as well.
    if (doc.image) patch.image = this.urlFormatter.format(doc.image);

    // If the Document has versioning information, format the base URL.
    if (doc.versioning) {
      patch.versioning = merge({}, doc.versioning, {
        baseUrl: this.urlFormatter.format(doc.versioning.baseUrl)
      });
    }

    return patch;
  }

}

NormalizeUrlsPlugin.defaults = {
  documentPathRegex: /^articles/
};

export default NormalizeUrlsPlugin;
