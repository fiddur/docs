import { basename, extname } from 'path';
import { clone, merge } from 'lodash';

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
    this.meta = meta;
    this.path = file.path;
    this.filename = file.filename;
    this.hash = basename(file.filename);
    this.extension = extname(file.filename);
    this.dependencies = new Set([this.filename]);
  }

  addMetadata(patch) {
    this.meta = merge(this.meta, patch);
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
        throw new Error(`While rendering document ${this.path}: document has no render`);
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

  getMetadata() {
    return clone(this.meta);
  }

  toJSON() {
    return this.getMetadata();
  }

}

export default Document;
