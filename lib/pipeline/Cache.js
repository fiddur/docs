import assert from 'assert';
import d from 'debug';
import _ from 'lodash';
import Reducer from './models/Reducer';

const debug = d('docs:cache');

/**
 * Stores compiled documents and allows them to be looked up by URL or path.
 */
class Cache {

  /**
   * Creates a Cache.
   */
  constructor(options = {}) {
    assert(options.compiler, 'Cache constructor requires a compiler option');
    assert(options.watcher, 'Cache constructor requires a watcher option');
    this.compiler = options.compiler;
    this.watcher = options.watcher;
    this.docs = {};
    this.docsByUrl = {};
    this.watcher.on('add', this.handleFileAdded.bind(this));
    this.watcher.on('change', this.handleFileChanged.bind(this));
  }

  handleFileAdded(file) {
    const doc = this.compiler.compile(file);
  }

  handleFileChanged(file) {
    const oldDoc = this.docs[file.filename];
    if (oldDoc) {
      // Recompile all documents that depend on the document that changed.
    }
    const newDoc = this.compiler.compile(file);
  }

  /**
   * Adds a document to the Cache.
   * @param {Document} doc - The document to add.
   */
  add(doc) {
    debug(`added ${doc.filename} at url ${doc.url}`);
    this.docs[doc.filename] = doc;
    this.docsByUrl[doc.url] = doc;
  }

  /**
   * Return the document in the cache with the specified URL.
   * @param {string} url - The URL to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  getByUrl(url) {
    return this.docsByUrl[url];
  }

  /**
   * Return the document in the cache with the specified filename.
   * @param {string} filename - The filename to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  getByFilename(filename) {
    return this.docsByFilename[filename];
  }

  /**
   * Given a fragment of metadata, return the first document in the cache which matches.
   * @param {Function} predicate - A predicate function.
   * @returns {Document} The document, or undefined if no match was found.
   */
  find(predicate) {
    return _.find(this.docs, predicate);
  }

  /**
   * Given a predicate function, return all documents in the cache which match.
   * @param {Function} predicate - A predicate function.
   * @returns {Array} An array of Documents that matched the query.
   */
  filter(predicate) {
    return _.filter(this.docs, predicate);
  }

  /**
   * Executes the specified function for each document in the cache.
   * @param {Function} The function to execute.
   */
  forEach(func) {
    this.docs.forEach(func);
  }

  /**
   * Call the specified function once for each document in the cache and collect the results.
   * @param {Function} func - The function to call.
   * @returns {Array} An array of values returned from the function calls.
   */
  map(func) {
    return this.docs.map(func);
  }

}

export default Cache;
