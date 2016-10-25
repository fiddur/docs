import assert from 'assert';
import d from 'debug';
import EventEmitter from 'events';
import File from './models/File';

const debug = d('docs:cache');

/**
 * Stores compiled documents and allows them to be looked up by URL or path.
 */
class Cache extends EventEmitter {

  /**
   * Creates a Cache.
   */
  constructor(options = {}) {
    super();
    assert(options.compiler, 'Cache constructor requires a compiler option');
    assert(options.watcher, 'Cache constructor requires a watcher option');
    this.compiler = options.compiler;
    this.watcher = options.watcher;
    this.documentPaths = options.documentPaths || Cache.defaults.documentPaths;
    this.docsByPath = {};
    this.docsByFilename = {};
    this.docsByUrl = {};
    this.watcher.on('add', this.handleFileAdded.bind(this));
    this.watcher.on('change', this.handleFileChanged.bind(this));
    this.watcher.on('ready', this.handleWatcherReady.bind(this));
  }

  /**
   * Adds a document to the Cache.
   * @param {Document} doc - The document to add.
   */
  add(doc) {
    debug(`added ${doc.filename} at url ${doc.url}`);
    this.docsByPath[doc.path] = doc;
    this.docsByFilename[doc.filename] = doc;
    this.docsByUrl[doc.url] = doc;
    this.emit('add', doc);
  }

  /**
   * Renders the content for all documents that have been loaded.
   */
  warm() {
    Object.keys(this.docsByPath)
    .forEach(path => {
      const doc = this.docsByPath[path];
      doc.render();
    });
  }

  /**
   * Return the document in the cache with the specified path relative to the baseDir.
   * @param {string} path - The path to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  get(path) {
    return this.docsByPath[path];
  }

  /**
   * Return the document in the cache with the specified (absolute) filename.
   * @param {string} filename - The filename to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  getByFilename(filename) {
    return this.docsByFilename[filename];
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
   * Return all documents whose path begin with the specified string.
   * @param {string} query - The string to search for.
   */
  find(query) {
    return Object.keys(this.docsByPath)
    .filter(path => path.indexOf(query) === 0)
    .map(path => this.docsByPath[path]);
  }

  handleFileAdded(file) {
    if (this.documentPaths.some(regex => regex.test(file.path))) {
      const doc = this.compiler.compile(file, this);
      this.add(doc);
    }
  }

  handleFileChanged(file) {
    Object.keys(this.docsByFilename)
    .filter(filename => this.docsByFilename[filename].hasDependency(file.filename))
    .forEach(filename => {
      const dependent = this.watcher.load(filename);
      const doc = this.compiler.compile(dependent, this);
      this.add(doc);
    });
  }

  handleWatcherReady() {
    this.emit('ready');
  }

}

Cache.defaults = {
  documentPaths: [/^articles/]
};

export default Cache;
