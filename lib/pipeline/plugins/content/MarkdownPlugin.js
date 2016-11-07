import { parseMarkdown } from '../../util';

/**
 * Transforms Markdown content into HTML.
 */
class MarkdownPlugin {

  /**
   * Creates an instance of MarkdownPlugin.
   * @param {Object} [options] - An options hash.
   * @param {Object} [options.parseMarkdown] - A function that will be used to render the markdown.
   */
  constructor(options = {}) {
    this.parseMarkdown = options.parseMarkdown || MarkdownPlugin.defaults.parseMarkdown;
  }

  /**
   * Transforms the specified content if the specified document's extension is .md.
   * @param {Document} doc - The document being processed.
   * @param {String} content - The current content for the document.
   * @returns {String} The (potentially-transformed) content for the document.
   */
  preprocess(doc, content) {
    if (doc.extension === '.md') return this.parseMarkdown(content);
    return content;
  }

}

MarkdownPlugin.defaults = {
  parseMarkdown
};

export default MarkdownPlugin;
