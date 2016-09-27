import d from 'debug';
import _ from 'lodash';

const debug = d('docs:cache');

/**
 * Stores compiled documents and allows them to be looked up by URL or path.
 */
class Cache {

  /**
   * Creates a Cache.
   */
  constructor() {
    this.docsByUrl = {};
    this.docsByPath = {};
    this.docsByFilename = {};
    this.publicUrls = [];
  }

  /**
   * Adds a document to the Cache.
   * @param {Document} doc - The document to add.
   */
  add(doc) {
    debug(`added ${doc.meta.path} at url ${doc.meta.url}`);
    this.docsByUrl[doc.meta.url] = doc;
    this.docsByPath[doc.meta.path] = doc;
    this.docsByFilename[doc.meta.filename] = doc;
    if (doc.meta.public) {
      this.publicUrls.push(doc.meta.url);
    }
  }

  /**
   * Returns a document stored in the Cache.
   * @param {Object} options - A query object.
   * @param {string} [options.url] - The URL of the document.
   * @param {string} [options.path] - The path of the document, relative to the base docs directory.
   * @param {string} [options.filename] - The absolute filename of the document.
   * @returns {Document} The document, or undefined if no match was found.
   */

  get(options) {
    if (options.url) return this.docsByUrl[options.url];
    if (options.path) return this.docsByPath[options.path];
    if (options.filename) return this.docsByFilename[options.filename];
    throw new Error('Calls to Cache.get() must include url, path, or filename');
  }

}

export default Cache;
