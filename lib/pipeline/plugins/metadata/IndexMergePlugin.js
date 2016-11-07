import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { omit } from 'lodash';

/**
 * Merges metadata from index files stored in the same directory as the Document.
 * This is used in the Quickstarts to allow the platform index.yml files to declare
 * common metadata (e.g. snippets) that are used in all documents for the platform.
 */
class IndexMergePlugin {

  /**
   * Creates an instance of IndexMergePlugin.
   * @param {Object} [options] - An options hash.
   * @param {Function} [options.resolve] - A function that returns the filename of the index file.
   * @param {Function} [options.load] - A function that reads the metadata from the index file.
   */
  constructor(options = {}) {
    this.resolve = options.resolve || IndexMergePlugin.defaults.resolve;
    this.load = options.load || IndexMergePlugin.defaults.load;
  }

  /**
   * Reads an returns a patch containing the metadata from the index file associated with
   * the Document, if one exists.
   * @param {Document} - The document in question.
   * @param {String} - The unprocessed content of the document.
   * @returns {Object} - An object containing new metadata, or null if none.
   */
  getMetadata(doc, content) {
    const indexFilename = this.resolve(doc.filename);
    if (fs.existsSync(indexFilename)) {
      try {
        const text = fs.readFileSync(indexFilename, 'utf8');
        const metadata = this.load(text);
        // Return only the properties that aren't already set on the document.
        return omit(metadata, doc.getMetadataProperties());
      } catch (err) {
        err.message = `Error reading metadata from index file at ${indexFilename}: ${err.message}`;
        throw err;
      }
    }

    return null;
  }

}

IndexMergePlugin.defaults = {
  resolve: (filename) => path.join(path.dirname(filename), 'index.yml'),
  load: yaml.safeLoad
};

export default IndexMergePlugin;
