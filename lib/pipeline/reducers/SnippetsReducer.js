import assert from 'assert';
import fs from 'fs';
import lsr from 'lsr';
import matter from 'gray-matter';
import _ from 'lodash';
import { dirname, extname, relative } from 'path';
import Tree from '../models/Tree';
import { parseMarkdown } from '../util';

/**
 * Reduces a Cache into an array of all snippets that are available on the system.
 * (NB: Strangely, this doesn't currently use the Cache itself, but it has to be a reduction
 * to ensure it is updated based on changes to the filesystem.)
 */
class SnippetsReducer {

  /**
   * Creates an instance of SnippetsReducer.
   * @param {Object} options - An options hash.
   * @param {String} options.snippetsDir - The base directory to scan for snippets.
   * @param {Object} options.vars - Global variables to expose to the snippet content templates.
   * @param {Array<string>} [options.extensions] - An array of file extensions to consider.
   * @param {Function} [options.parseFrontMatter] - A function that reads front matter from files.
   * @param {Function} [options.parseMarkdown] - A function that can render Markdown content.
   * @param {Function} [options.createTemplate] - A function that can create template functions.
   */
  constructor(options = {}) {
    assert(options.snippetsDir, 'SnippetsReducer requires a snippetsDir option');
    assert(options.vars, 'SnippetsReducer requires a vars option');
    this.snippetsDir = options.snippetsDir;
    this.vars = options.vars;
    this.extensions = options.extensions || SnippetsReducer.defaults.extensions;
    this.parseFrontMatter = options.parseFrontMatter || SnippetsReducer.defaults.parseFrontMatter;
    this.parseMarkdown = options.parseMarkdown || SnippetsReducer.defaults.parseMarkdown;
    this.createTemplate = options.createTemplate || SnippetsReducer.defaults.createTemplate;
  }

  /**
   * Recursively scans the filesystem for all snippet files within the snippets directory,
   * reads metadata from the files, and returns a Tree of the resulting information.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Tree} An Tree representing the snippets in the system.
   */
  reduce(cache) {
    const result = new Tree();

    lsr.sync(this.snippetsDir)
    .filter(file => this.extensions.indexOf(extname(file.name)) !== -1)
    .forEach(file => {
      const extension = extname(file.name);

      const snippet = this.parseFrontMatter(fs.readFileSync(file.fullPath, 'utf8'));
      if (extension === '.md') snippet.content = this.parseMarkdown(snippet.content);

      const func = this.createTemplate(snippet.content);
      const content = func(this.vars);

      const path = relative(this.snippetsDir, file.fullPath).replace(extension, '');
      const value = Object.assign({ content }, snippet.data);

      result.add(path, value);
    });

    return result;
  }

}

SnippetsReducer.defaults = {
  extensions: ['.md', '.html'],
  parseFrontMatter: matter,
  parseMarkdown,
  createTemplate: _.template
};

export default SnippetsReducer;
