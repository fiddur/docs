import assert from 'assert';
import fs from 'fs';
import lsr from 'lsr';
import matter from 'gray-matter';
import { find } from 'lodash';
import { dirname, extname, relative } from 'path';
import Tree from '../models/Tree';
import { parseMarkdown } from '../util';

class SnippetsReducer {

  constructor(options = {}) {
    assert(options.snippetsDir, 'SnippetsReducer requires a snippetsDir option');
    this.extensions = options.extensions || SnippetsReducer.defaults.extensions;
    this.parseFrontMatter = options.parseFrontMatter || SnippetsReducer.defaults.parseFrontMatter;
    this.snippetsDir = options.snippetsDir;
  }

  reduce(cache) {
    const result = new Tree();

    lsr.sync(this.snippetsDir)
    .filter(file => this.extensions.indexOf(extname(file.name)) !== -1)
    .forEach(file => {
      const extension = extname(file.name);

      const snippet = this.parseFrontMatter(fs.readFileSync(file.fullPath, 'utf8'));
      if (extension === '.md') snippet.content = parseMarkdown(snippet.content);

      const path = relative(this.snippetsDir, file.fullPath).replace(extension, '');
      const value = Object.assign({ content: snippet.content }, snippet.data);

      result.add(path, value);
    });

    return result;
  }

}

SnippetsReducer.defaults = {
  extensions: ['.md', '.html'],
  parseFrontMatter: matter
};

export default SnippetsReducer;
