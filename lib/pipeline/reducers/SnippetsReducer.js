import assert from 'assert';
import fs from 'fs';
import lsr from 'lsr';
import matter from 'gray-matter';
import { find } from 'lodash';
import { dirname, extname, relative } from 'path';
import Tree from '../models/Tree';

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
      const { data, content } = this.parseFrontMatter(fs.readFileSync(file.fullPath, 'utf8'));
      const path = relative(this.snippetsDir, file.fullPath).replace(extname(file.name), '');
      const value = Object.assign({ content }, data);
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
