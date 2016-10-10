import { basename, extname } from 'path';
import matter from 'gray-matter';
import _ from 'lodash';
import Document from './models/Document';

/**
 * Translates Files into rendered Documents which can be served.
 */
class Compiler {

  /**
   * Creates a Compiler.
   * @param {Object} [options] - An options hash.
   * @param {Function} [options.parseFrontMatter] - A function to use to extract front matter.
   * @param {Function} [options.compileTemplate] - A function to use to create template functions.
   */
  constructor(options = {}) {
    this.parseFrontMatter = options.parseFrontMatter || Compiler.defaults.parseFrontMatter;
    this.compileTemplate = options.compileTemplate || Compiler.defaults.compileTemplate;
  }

  /**
   * Compiles a File, creating a rendered Document.
   * @param {File} file - The file to compile.
   * @param {Array} metadataPlugins - An array of plugins to use to gather document metadata.
   * @param {Array} contentPlugins - An array of plugins to use to transform the document's content.
   * @returns {Document} The compiled Document.
   */
  compile(file, metadataPlugins, contentPlugins) {
    try {
      const result = this.parseFrontMatter(file.text);

      let meta = result.data || {};
      let content = result.content || '';

      meta.path = file.path;
      meta.filename = file.filename;
      meta.hash = basename(file.filename);
      meta.extension = extname(file.filename);
      meta.isSpecial = file.filename.indexOf('_') === 0;
      meta.isInclude = file.filename.indexOf('_includes') !== -1;

      // Gather additional metadata for the document.
      metadataPlugins.forEach(plugin => {
        const patch = plugin.getMetadata(meta, content);
        if (patch) {
          meta = _.merge({}, meta, patch);
        }
      });

      // Transform the document's content.
      contentPlugins.forEach(plugin => {
        content = plugin.transform(meta, content);
      });

      // Compile the template function, and attach it to the document.
      const template = this.compileTemplate(content);
      return new Document(meta, template);
    } catch (err) {
      err.message = `Error compiling document ${file.path}: ${err.message}`;
      throw err;
    }
  }

}

Compiler.defaults = {
  parseFrontMatter: matter,
  compileTemplate: _.template
};

export default Compiler;
