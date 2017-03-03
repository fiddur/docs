import assert from 'assert';

/**
 * Adds an quickstart property to Document metadata if it is in one of the quickstart paths.
 */
class AutoQuickstartPlugin {

  /**
   * Creates an instance of AutoQuickstartPlugin.
   * @param {Object} options - An options hash.
   * @param {String} options.appTypes - The app types whose slugs define which docs are quickstarts.
   */
  constructor(options = {}) {
    assert(options.appTypes, 'AutoQuickstartPlugin constructor requires a appTypes option');
    this.regex = new RegExp('^articles/quickstart');
  }

  /**
   * Returns a metadata patch containing an metadata property if the document
   * is within one of the quickstart paths.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (!doc.quickstart && this.regex.test(doc.shortname)) {
      return { quickstart: true };
    }

    return null;
  }

}

export default AutoQuickstartPlugin;
