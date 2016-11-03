import assert from 'assert';
import { basename, extname } from 'path';
import matter from 'gray-matter';
import d from 'debug';
import _, { merge } from 'lodash';
import Document from './models/Document';
import createRenderer from './createRenderer';

const debug = d('docs:compiler');
const isMetadataPlugin = plugin => typeof plugin.getMetadata === 'function';
const isContentPlugin = plugin => typeof plugin.transform === 'function';

/**
 * Translates Files into rendered Documents which can be served.
 */
class Compiler {

  /**
   * Creates a Compiler.
   * @param {Object} [options] - An options hash.
   * @param {Object} options.vars - A hash of environmental vars to pass to all templates.
   * @param {Function} [options.parseFrontMatter] - A function to use to extract front matter.
   * @param {Function} [options.createTemplate] - A function to use to create template functions.
   */
  constructor(options = {}) {
    assert(options.vars, 'Compiler constructor requires an vars option');
    this.vars = options.vars;
    this.parseFrontMatter = options.parseFrontMatter || Compiler.defaults.parseFrontMatter;
    this.createTemplate = options.createTemplate || Compiler.defaults.createTemplate;
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
   * @param {Cache} cache - The cache that is controlling the compilation.
   * @returns {Document} The compiled Document.
   */
  compile(file, cache) {
    try {
      const result = this.parseFrontMatter(file.text);

      const doc = new Document(file, result.data);
      let content = result.content || '';

      // Gather additional metadata for the document.
      this.plugins.filter(isMetadataPlugin).forEach(plugin => {
        const patch = plugin.getMetadata(doc, content);
        if (patch) doc.addMetadata(patch);
      });

      // Allow plugins to transform the document's content.
      this.plugins.filter(isContentPlugin).forEach(plugin => {
        content = plugin.transform(doc, content);
      });

      // Compile the template function.
      const template = this.createTemplate(content);

      // Create the renderer for the document.
      doc.render = createRenderer(template, doc, cache, this.vars);

      return doc;
    } catch (err) {
      err.message = `Error compiling document ${file.shortname}: ${err.message}`;
      throw err;
    }
  }

}

Compiler.defaults = {
  parseFrontMatter: matter,
  createTemplate: _.template
};

export default Compiler;
