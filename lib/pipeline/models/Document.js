import { basename, extname } from 'path';
import { pick } from 'lodash';

/**
 * Represents a compiled article.
 */
class Document {

  /**
   * Creates a Document.
   * @param {File} file - The File from which the Document was created.
   * @param {Object} [meta] - A hash of additional properties to set on the Document.
   */
  constructor(file, meta = {}) {
    this.filename = file.filename;
    this.shortname = file.shortname;
    this.basename = basename(file.filename);
    this.extension = extname(file.filename);
    this.path = this.shortname.replace(this.extension, '').replace(/\/index$/, '');
    this.hash = this.basename.replace(this.extension, '');
    this.dependencies = new Set([this.filename]);
    this.metadataProperties = [];
    this.addMetadata(meta);
  }

  /**
   * Adds the specified metadata properties to the Document.
   * @param {Object} patch - An object containing the properties to add.
   */
  addMetadata(patch) {
    this.metadataProperties = this.metadataProperties.concat(Object.keys(patch));
    Object.assign(this, patch);
  }

  /**
   * Returns a list of the metadata properties of the Document.
   * @returns {Array<string>} The list of metadata properties.
   */
  getMetadataProperties() {
    return [].concat(this.metadataProperties);
  }

  /**
   * Returns an object containing the metadata properties for the Document.
   * @returns {Object} The hash of metadata properties.
   */
  getMetadata() {
    return pick(this, this.metadataProperties);
  }

  /**
   * Adds the specified filename as a dependency of the Document. This is used by
   * the Cache to determine which Documents must be recompiled when files change on disk.
   * @param {String} filename - The filename on which this Document depends.
   */
  addDependency(filename) {
    this.dependencies.add(filename);
  }

  /**
   * Returns a value indicating whether this Document depends on the specified filename.
   * @param {String} filename - The filename in question.
   * @returns {Boolean} True if the Document depends on the filename, otherwise false.
   */
  hasDependency(filename) {
    return this.dependencies.has(filename);
  }

  /**
   * Returns the final rendered content for the Document, compiling it first by calling
   * the Document's render() function if necessary.
   * @returns {String} The rendered content for the Document.
   */
  getContent() {
    if (!this.content) {
      if (!this.render) {
        throw new Error(`While rendering document ${this.path}: document has no renderer`);
      }
      try {
        this.content = this.render();
      } catch (err) {
        err.message = `While rendering document ${this.path}: ${err.message}`;
        throw err;
      }
    }
    return this.content;
  }

  /**
   * Returns a serializable version of the document's metadata suitable for transmission as JSON.
   * @returns {Object} A hash of the document's metadata.
   */
  toJSON() {
    return this.getMetadata();
  }

}

export default Document;
