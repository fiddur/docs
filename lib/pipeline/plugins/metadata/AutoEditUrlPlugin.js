/**
 * Adds an editUrl property to Document metadata unless one has already been set.
 */
class AutoEditUrlPlugin {

  /**
   * Creates an instance of AutoEditUrlPlugin.
   * @param {Object} [options] - An options hash.
   * @param {String} [options.baseUrl] - The base URL to use to construct editUrls.
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || AutoEditUrlPlugin.defaults.baseUrl;
  }

  /**
   * Returns a metadata patch containing an editUrl property unless the document
   * has already specified one.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (!doc.editUrl) {
      return { editUrl: this.baseUrl + doc.shortname };
    }

    return null;
  }

}

AutoEditUrlPlugin.defaults = {
  baseUrl: 'https://github.com/auth0/docs/edit/master/'
};

export default AutoEditUrlPlugin;
