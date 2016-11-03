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

  addMetadata(patch) {
    this.metadataProperties = this.metadataProperties.concat(Object.keys(patch));
    Object.assign(this, patch);
  }

  getMetadataProperties() {
    return [].concat(this.metadataProperties);
  }

  getMetadata() {
    return pick(this, this.metadataProperties);
  }

  addDependency(filename) {
    this.dependencies.add(filename);
  }

  hasDependency(filename) {
    return this.dependencies.has(filename);
  }

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

  toJSON() {
    return this.getMetadata();
  }

}

export default Document;
