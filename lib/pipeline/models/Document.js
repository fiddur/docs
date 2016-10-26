import { basename, extname } from 'path';
import { merge } from 'lodash';

/**
 * Represents a compiled article.
 */
class Document {

  /**
   * Creates a Document.
   * @param {File} file - The File from which the Document was created.
   * @param {Object} [metadata] - A hash of additional properties to set on the Document.
   */
  constructor(file, metadata) {
    if (metadata) merge(this, metadata);
    this.path = file.path;
    this.filename = file.filename;
    this.hash = basename(file.filename);
    this.extension = extname(file.filename);
    this.dependencies = new Set([this.filename]);
  }

  addDependency(filename) {
    this.dependencies.add(filename);
  }

  hasDependency(filename) {
    return this.dependencies.has(filename);
  }

  render() {
    if (!this.renderer) {
      throw new Error(`While rendering document ${this.path}: document has no renderer`);
    }
    if (!this.content) {
      try {
        this.content = this.renderer();
      } catch (err) {
        err.message = `While rendering document ${this.path}: ${err.message}`;
        throw err;
      }
    }
    return this.content;
  }

  toJSON() {
    return {
      title: this.title,
      url: this.url,
      description: this.description
    };
  }

}

export default Document;
