import { basename, dirname } from 'path';

/**
 * Adds a version property with a default value to Document metadata,
 * unless one has already been set.
 */
class AutoVersionPlugin {

  /**
   * Unless the document has already specified one, returns a metadata patch
   * containing a version property inferred from the name of the document's directory.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    if (doc.versioning && !doc.version) {
      return { version: basename(dirname(doc.filename)) };
    }

    return null;
  }

}

export default AutoVersionPlugin;
