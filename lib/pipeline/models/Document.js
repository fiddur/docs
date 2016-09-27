/**
 * Represents a compiled article that can be rendered.
 */
class Document {

  /**
   * Creates a Document.
   * @param {Object} meta - A serializable metadata hash associated with the Document.
   * @param {Function} template - The template function used to render the Document.
   */
  constructor(meta, template) {
    this.meta = meta;
    this.template = template;
  }

  /**
   * Renders the Document by passing the specified context hash to its template function.
   * @param {Object} context - The context object to pass.
   * @returns {string} The rendered content for the Document.
   */
  render(context) {
    return this.template(context);
  }

}

export default Document;
