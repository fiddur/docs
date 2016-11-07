import assert from 'assert';
import { basename, dirname } from 'path';

/**
 * Transforms a Cache into an array of objects, each of which represents metadata from articles
 * that describe third-party connections.
 */
class ConnectionsReducer {

  /**
   * Creates an instance of ConnectionsReducer.
   * @param {Object} options - An options hash.
   * @param {UrlFormatter} options.urlFormatter - The UrlFormatter instance to use.
   */
  constructor(options = {}) {
    assert(options.urlFormatter, 'ConnectionsReducer constructor requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
  }

  /**
   * Given a cache, returns an array of transformed metadata for articles describing
   * third-party connections.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Array<Object>} An array of summarized metadata read from connection documents.
   */
  reduce(cache) {
    return cache.find('articles/connections')
    .filter(doc => doc.connection)
    .map(doc => ({
      title: doc.connection,
      hash: doc.hash,
      url: this.urlFormatter.format(doc.url),
      image: this.urlFormatter.format(doc.image),
      type: basename(dirname(doc.filename)),
      alias: doc.alias,
      seo_alias: doc.seo_alias
    }));
  }

}

export default ConnectionsReducer;
