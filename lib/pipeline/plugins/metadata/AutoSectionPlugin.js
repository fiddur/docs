/**
 * Adds a section property with a default value to Document metadata,
 * unless one has already been set.
 */
class AutoSectionPlugin {

  /**
   * Creates an instance of AutoSectionPlugin.
   * @param {Object} [options] - An options hash.
   * @param {String} [options.section] - The default section value to set.
   */
  constructor(options = {}) {
    this.section = options.section || AutoSectionPlugin.defaults.section;
  }

  /**
   * Returns a metadata patch containing an section property unless the document
   * has already specified one.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (!doc.section) {
      return { section: this.section };
    }

    return null;
  }

}

AutoSectionPlugin.defaults = {
  section: 'articles'
};

export default AutoSectionPlugin;
