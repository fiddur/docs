import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { merge, omit } from 'lodash';

/**
 * Recursively scans up from the document's position in the filesystem and merges in
 * metadata from any index.yml files that are found.
 */
class IndexMergePlugin {

  /**
   * Creates an instance of IndexMergePlugin.
   * @param {Object} options - An options hash.
   * @param {string} options.baseDir - The base (root) directory for articles.
   * @param {Function} [options.load] - A function that reads the metadata from the index file.
   */
  constructor(options = {}) {
    this.baseDir = options.baseDir;
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
    let metadata = null;

    const tokens = doc.shortname.split(path.sep).slice(0, -1);
    const curr = [];
    while (tokens.length > 0) {
      curr.push(tokens.shift());
      const filename = path.join(this.baseDir, ...curr, 'index.yml');
      if (fs.existsSync(filename)) {
        try {
          // Return only the properties that aren't already set on the document.
          const text = fs.readFileSync(filename, 'utf8');
          const properties = omit(this.load(text), doc.getMetadataProperties());
          metadata = merge(metadata, properties);
        } catch (err) {
          err.message = `Error reading metadata from index file at ${filename}: ${err.message}`;
          throw err;
        }
      }
    }

    return metadata;
  }

}

IndexMergePlugin.defaults = {
  load: yaml.safeLoad
};

export default IndexMergePlugin;
