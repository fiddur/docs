/**
 * Ensures that the public and sitemap properties in Document metadata are set to true,
 * unless they have been explicitly set to false.
 */
class FlagsPlugin {

  /**
   * Returns a patch that normalizes the public and sitemap properties for the document.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    // This will normalize the public and sitemap properties to Boolean values.
    return {
      public: doc.public !== false,
      sitemap: doc.sitemap !== false
    };
  }

}

export default FlagsPlugin;
