/**
 * Adds a title property to Document metadata by parsing it from the raw Markdown
 * content, unless one has already been set.
 */
class AutoTitlePlugin {

  /**
   * Creates an instance of AutoTitlePlugin.
   * @param {Object} [options] - An options hash.
   * @param {RegExp} [options.regex] - The regular expression to use to extract a title.
   * @param {String} [options.defaultTitle] - The fallback default title to use.
   */
  constructor(options = {}) {
    this.regex = options.regex || AutoTitlePlugin.defaults.regex;
    this.defaultTitle = options.defaultTitle || AutoTitlePlugin.defaults.defaultTitle;
  }

  /**
   * If the Document does not already have a title, attempts to parse one from the
   * content, or failing that, gives it a default title.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (doc.title) {
      return null;
    }

    const match = content.match(this.regex);
    if (match && match.length) {
      const title = match[0].slice(1).trim();
      return { title };
    }

    return { title: this.defaultTitle };
  }

}

AutoTitlePlugin.defaults = {
  regex: /#{1}[^\n#]+/g,
  defaultTitle: 'Document'
};

export default AutoTitlePlugin;
