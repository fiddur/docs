/**
 * Adds a url property to Document metadata based on the Document's path,
 * unless one has already been set.
 */
class AutoUrlPlugin {

  /**
   * Creates an instance of AutoUrlPlugin.
   * @param {Object} [options] - An options hash.
   * @param {RegExp} documentPathRegex - A regular expression describing the root path for articles.
   */
  constructor(options = {}) {
    this.documentPathRegex = options.documentPathRegex || AutoUrlPlugin.defaults.documentPathRegex;
  }

  /**
   * If the Document does not already have a url, generates one using its path.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (!doc.url) {
      const url = doc.path.replace(this.documentPathRegex, '');
      return { url };
    }

    return null;
  }

}

AutoUrlPlugin.defaults = {
  documentPathRegex: /^articles/
};

export default AutoUrlPlugin;
