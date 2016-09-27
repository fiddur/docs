import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import lsr from 'lsr';
import _ from 'lodash';
import d from 'debug';
import Document from './models/Document';

const debug = d('docs:compiler');

/**
 * Translates Files into Documents by passing them through a pipeline of plugins.
 * These plugins can transform the metadata and content from the files in a step-wise fashion.
 */
class Compiler {

  /**
   * Creates a Compiler.
   * @param {Object} [options] - An options hash.
   * @param {Array} [options.plugins] - An array of plugins to use.
   * @param {Function} [options.parseFrontMatter] - A function to use to extract front matter.
   * @param {Function} [options.compileTemplate] - A function to use to create template functions.
   */
  constructor(options = {}) {
    this.plugins = options.plugins || [];
    this.parseFrontMatter = options.parseFrontMatter || matter;
    this.compileTemplate = options.compileTemplate || _.template;
  }

  /**
   * Adds a plugin to the pipeline.
   * @param {Object} plugin - The plugin to add, which must be a metadata or content transformer.
   */
  use(plugin) {
    if (!this.isMetadataTransformer(plugin) && !this.isContentTransformer(plugin)) {
      throw new Error('Compiler.plugin() was called with an invalid plugin');
    }
    this.plugins.push(plugin);
  }

  /**
   * Compiles a File, creating a Document which can be rendered.
   * @param {File} file - The file to compile.
   * @returns {Document} The compiled Document.
   */
  compile(file) {
    const result = this.parseFrontMatter(file.text);
    let meta = result.data || {};
    let content = result.content || '';

    meta.path = file.path;
    meta.filename = file.filename;
    meta.extension = path.extname(file.filename);

    // Use the pipeline to gather additional metadata for the document.
    this.plugins.forEach(plugin => {
      if (this.isMetadataTransformer(plugin)) {
        const patch = plugin.getMetadata(meta, content);
        if (patch) {
          meta = _.merge({}, meta, patch);
        }
      }
    });

    // Allow the pipeline to transform the document's content.
    this.plugins.forEach(plugin => {
      if (this.isContentTransformer(plugin)) {
        content = plugin.transform(meta, content);
      }
    });

    try {
      const template = this.compileTemplate(content);
      return new Document(meta, template);
    } catch (err) {
      err.message = `Error compiling document ${meta.path}: ${err.message}`;
      throw err;
    }
  }

  isMetadataTransformer(plugin) {
    return typeof plugin.getMetadata === 'function';
  }

  isContentTransformer(plugin) {
    return typeof plugin.transform === 'function';
  }

}

export default Compiler;
