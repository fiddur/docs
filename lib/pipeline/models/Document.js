import path from 'path';
import { merge } from 'lodash';

/**
 * Represents a compiled article.
 */
class Document {

  /**
   * Creates a Document.
   * @param {Object} meta - A serializable metadata hash associated with the Document.
   * @param {Function} template - The template function to use to render the Document.
   */
  constructor(meta, template) {
    this.template = template;
    this.dependencies = new Set();
    merge(this, meta);
  }

  render() {
    if (!this.content) {
      try {
        this.content = this.template(this.context);
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
