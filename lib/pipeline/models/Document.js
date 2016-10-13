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

  render() {
    if (!this.content) {
      try {
        this.content = this.template(this);
      } catch (err) {
        err.message = `Error rendering ${this.filename}: ${err.message}`;
        throw err;
      }
    }
    return this.content;
  }

  addDependency(filename) {
    this.dependencies.add(filename);
  }

}

export default Document;
