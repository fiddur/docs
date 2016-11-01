import d from 'debug';
import assert from 'assert';
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
    this.isDocument = options.isDocument || Cache.defaults.isDocument;
    this.docsByPath = {};
    this.docsByFilename = {};
    this.docsByUrl = {};
    this.pendingCallbacks = [];
    this.isReady = false;
    this.watcher.on('add', this.handleFileAdded.bind(this));
    this.watcher.on('change', this.handleFileChanged.bind(this));
    this.watcher.on('ready', this.handleWatcherReady.bind(this));
  }

  /**
   * Adds a document to the Cache.
   * @param {Document} doc - The document to add.
   */
  add(doc) {
    debug(`[add] ${doc.path}`);
    this.docsByPath[doc.path] = doc;
    this.docsByFilename[doc.filename] = doc;
    this.docsByUrl[doc.meta.url] = doc;
    this.emit('add', doc);
  }

  /**
   * Renders the content for all documents that have been loaded.
   */
  warm() {
    Object.keys(this.docsByPath)
    .forEach(path => {
      const doc = this.docsByPath[path];
      doc.getContent();
    });
  }

  /**
   * Return the document in the cache with the specified path relative to the baseDir,
   * or throws an Error if no such document exists.
   * @param {string} path - The path to match.
   * @returns {Document} The document document with the specified path.
   */
  get(path) {
    const doc = this.tryGet(path);
    if (!doc) {
      throw new Error(`No document with the path ${path} exists in the cache`);
    }
    return doc;
  }

  /**
   * Return the document in the cache with the specified path relative to the baseDir.
   * @param {string} path - The path to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  tryGet(path) {
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

  /**
   * Executes the specified function once for each document in the cache.
   * @param {Function} func - The function to execute.
   */
  forEach(func) {
    Object.keys(this.docsByPath).forEach(path => {
      func(this.docsByPath[path]);
    });
  }

  /**
   * Calls the specified function once the Cache is ready (once its watcher
   * has fired its ready event). If the Cache is already ready, the function
   * will be called immediately.
   * @param {Function} func - The function to call.
   */
  whenReady(func) {
    if (this.isReady) {
      func();
    } else {
      this.pendingCallbacks.push(func);
    }
  }

  getStats() {
    return { count: Object.keys(this.docsByPath).length };
  }

  handleFileAdded(file) {
    if (this.isDocument(file)) {
      const doc = this.compiler.compile(file, this);
      this.add(doc);
    }
  }

  handleFileChanged(changedFile) {
    const deps = Object.keys(this.docsByFilename)
      .filter(filename => this.docsByFilename[filename].hasDependency(changedFile.filename));

    debug(
      `[change] ${changedFile.path} (${deps.length} dependencies)\n` +
      deps.map(filename => `  + ${filename}`).join('\n')
    );

    const docs = deps.map(filename => {
      const file = this.watcher.load(filename);
      const doc = this.compiler.compile(file, this);
      this.add(doc);
      return doc;
    });

    this.emit('sync', docs);
  }

  handleWatcherReady() {
    this.isReady = true;
    this.pendingCallbacks.forEach(func => func());
    this.pendingCallbacks = [];
    this.emit('ready');
  }

}

Cache.defaults = {
  isDocument: (file) => (
    /^articles/.test(file.path) &&
    !file.path.split('/').some(segment => /^_/.test(segment))
  )
};

export default Cache;
