import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import lsr from 'lsr';
import _ from 'lodash';
import d from 'debug';
import Document from './document';

const debug = d('docs:compiler');

class Compiler {

  constructor(options = {}) {
    this.baseDir = options.baseDir;
    this.plugins = options.plugins || [];
    this.templateCompiler = options.templateCompiler || _.template;
  }

  use(plugin) {
    this.plugins.push(plugin);
  }

  load(filename) {
    return this.compile(filename, fs.readFileSync(filename, 'utf8'));
  }

  compile(filename, text) {
    debug(`compiling ${filename}`);

    let result = matter(text);
    let meta = result.data || {};
    let content  = result.content || '';
    
    meta.filename = path.normalize(filename);
    meta.path = meta.filename.replace(this.baseDir, '/');
    meta.extension = path.extname(filename);

    // Use the pipeline to gather additional metadata for the document.
    this.plugins.forEach(plugin => {
      if (typeof plugin.getMetadata === 'function') {
        let patch = plugin.getMetadata(meta, content);
        if (patch) {
          meta = _.merge({}, meta, patch);
        }
      }
    });

    // Allow the pipeline to transform the document's content.
    this.plugins.forEach(plugin => {
      if (typeof plugin.transform === 'function') {
        content = plugin.transform(meta, content);
      }
    });

    try
    {
      let template = this.templateCompiler(content);
      return new Document(meta, template);
    }
    catch (err) {
      err.message = `Error compiling document ${meta.path}: ${err.message}`;
      throw err;
    }

  }

}

export default Compiler;
