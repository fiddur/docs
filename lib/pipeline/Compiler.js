import assert from 'assert';
import { basename, extname } from 'path';
import matter from 'gray-matter';
import { merge, template } from 'lodash';
import Document from './models/Document';

const isMetadataPlugin = plugin => typeof plugin.getMetadata === 'function';
const isContentPlugin = plugin => typeof plugin.transform === 'function';

/**
 * Translates Files into rendered Documents which can be served.
 */
class Compiler {

  /**
   * Creates a Compiler.
   * @param {Object} [options] - An options hash.
   * @param {Parser} options.parser - The parser to use to extract the HTML for the document.
   * @param {Function} [options.parseFrontMatter] - A function to use to extract front matter.
   * @param {Function} [options.createTemplateFunction] - A function to use to create template functions.
   */
  constructor(options = {}) {
    assert(this.parser, 'Compiler constructor requires a parser option');
    this.parser = options.parser;
    this.parseFrontMatter = options.parseFrontMatter || Compiler.defaults.parseFrontMatter;
    this.createTemplateFunction = options.createTemplateFunction || Compiler.defaults.createTemplateFunction;
    this.plugins = [];
  }

  /**
   * Adds a plugin to the pipeline.
   * @param {Object} plugin - The plugin to add.
   */
  use(plugin) {
    if (!isMetadataPlugin(plugin) && !isContentPlugin(plugin)) {
      throw new Error(`Compiler.use() was called with an invalid plugin ${plugin}`);
    }
    this.plugins.push(plugin);
  }

  /**
   * Compiles a File, creating a rendered Document.
   * @param {File} file - The file to compile.
   * @param {Array} metadataPlugins - An array of plugins to use to gather document metadata.
   * @param {Array} contentPlugins - An array of plugins to use to transform the document's content.
   * @returns {Document} The compiled Document.
   */
  compile(file) {
    try {
      const result = this.parseFrontMatter(file.text);

      const doc = new Document(file, result.data);
      const text = result.content || '';

      // Gather additional metadata for the document.
      this.plugins.filter(isMetadataPlugin).forEach(plugin => {
        const patch = plugin.getMetadata(doc, text);
        if (patch) merge(doc, patch);
      });

      // Get the HTML content for the document.
      let content = this.parser.parse(doc, text);

      // Allow plugins to transform the document's content.
      this.plugins.filter(isContentPlugin).forEach(plugin => {
        content = plugin.transform(doc, content);
      });

      // Compile the template function, and attach it to the document.
      doc.template = this.createTemplateFunction(content);
      return doc;
    } catch (err) {
      err.message = `Error compiling document ${file.path}: ${err.message}`;
      throw err;
    }
  }

}

Compiler.defaults = {
  parseFrontMatter: matter,
  createTemplateFunction: template
};

export default Compiler;
