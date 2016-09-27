import path from 'path';
import _ from 'lodash';

/**
 * Represents a compiled article.
 */
class Document {

  /**
   * Creates a Document.
   * @param {Object} meta - A serializable metadata hash associated with the Document.
   * @param {Function} templateFunction - The template function to use to render the Document.
   */
  constructor(meta, templateFunction) {
    this.templateFunction = templateFunction;
    _.merge(this, meta);
  }


}

export default Document;
