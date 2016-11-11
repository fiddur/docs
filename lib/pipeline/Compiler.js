import assert from 'assert';
import { basename, extname } from 'path';
import matter from 'gray-matter';
import d from 'debug';
import _, { merge } from 'lodash';
import Document from './models/Document';
import createRenderContext from './util';

const debug = d('docs:compiler');
const isMetadataPlugin = plugin => typeof plugin.getMetadata === 'function';
const isPreProcessorPlugin = plugin => typeof plugin.preprocess === 'function';
const isPostProcessorPlugin = plugin => typeof plugin.postprocess === 'function';

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
    if (!isMetadataPlugin(plugin) &&
        !isPreProcessorPlugin(plugin) &&
        !isPostProcessorPlugin(plugin)) {
      throw new Error(`Compiler.use() was called with an invalid plugin ${plugin}`);
    }
    this.plugins.push(plugin);
  }

  /**
   * Compiles a File, creating a Document that can be rendered.
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

      // Allow pre-processor plugins to transform the pre-rendered content.
      this.plugins.filter(isPreProcessorPlugin).forEach(plugin => {
        content = plugin.preprocess(doc, content);
      });

      // Compile the template function.
      const template = this.createTemplate(content);

      // Create the renderer for the document.
      const context = this.createRenderContext(doc, cache, this.vars);

      // Attach a render function to the document.
      doc.render = () => {
        let renderedContent = template(context);

        // Allow post-processor plugins to transform the rendered content.
        this.plugins.filter(isPostProcessorPlugin).forEach(plugin => {
          renderedContent = plugin.postprocess(doc, renderedContent);
        });

        return renderedContent;
      };

      return doc;
    } catch (err) {
      err.message = `Error compiling document ${file.shortname}: ${err.message}`;
      throw err;
    }
  }

  /**
   * Creates a "render context", a hash of values that will be passed to the
   * template function. The structure is:
   *
   * { meta: <Document>,
   *   cache: <Cache wrapper>,
   *   ...global environmental vars }
   *
   * @param {Document} doc - The Document that is being rendered.
   * @param {Cache} cache - The related Cache instance.
   * @param {Object} vars - A hash of global environmental variables to pass to the template.
   * @returns {Object} The merged render context.
   * @private
   */
  createRenderContext(doc, cache, vars) {
    // Create a simple wrapper around the Cache instance so we can
    // track calls to cache lookups, and add the resulting documents
    // as dependencies of the calling document.
    const wrapper = {
      get: (path) => {
        const dep = cache.get(path);
        doc.addDependency(dep.filename);
        return dep;
      },
      tryGet: (path) => {
        const dep = cache.get(path);
        if (dep) doc.addDependency(dep.filename);
        return dep;
      },
      getByFilename: (filename) => {
        const dep = cache.get(filename);
        doc.addDependency(dep.filename);
        return dep;
      },
      getByUrl: (url) => {
        const dep = cache.getByUrl(url);
        doc.addDependency(dep.filename);
        return dep;
      },
      find: (query) => {
        const deps = cache.find(query);
        deps.forEach(dep => doc.addDependency(dep.filename));
        return deps;
      }
    };

    return Object.assign({ meta: doc, cache: wrapper }, vars);
  }

}

Compiler.defaults = {
  parseFrontMatter: matter,
  createTemplate: _.template
};

export default Compiler;
