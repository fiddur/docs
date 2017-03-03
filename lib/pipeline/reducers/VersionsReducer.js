import assert from 'assert';
import { dirname, resolve, join } from 'path';
import { merge } from 'lodash';
import { findMetadataFiles } from '../util';

class VersionsReducer {

  /**
   * Creates an instance of VersionsReducer.
   * @param {Object} options - An options hash.
   * @param {String} options.articlesDir - The base directory for articles.
   * @param {UrlFormatter} options.urlFormatter - The UrlFormatter instance to use.
   */
  constructor(options = {}) {
    assert(options.articlesDir, 'VersionsReducer constructor requires an articlesDir option');
    assert(options.urlFormatter, 'VersionsReducer constructor requires a urlFormatter option');
    this.articlesDir = options.articlesDir;
    this.urlFormatter = options.urlFormatter;
  }

  /**
   * Given a Cache, returns an array of items representing topics that are versioned.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Array<Object>} An array of versioned topics.
   */
  reduce(cache) {
    return findMetadataFiles(this.articlesDir, 'index.yml')
    .filter(entry => entry.data.versioning)
    .map(entry => {
      const { baseUrl, versions, defaultArticles } = entry.data.versioning;
      return {
        topic: entry.name,
        baseUrl,
        versions: versions.map(name => {
          const articles = cache.find(join('articles', baseUrl, name));
          const defaultHash = defaultArticles && defaultArticles[name] ? defaultArticles[name] : articles[0].hash;
          const defaultArticle = articles.find(article => article.hash === defaultHash);
          return {
            name,
            url: this.urlFormatter.format(defaultArticle.url)
          };
        })
      };
    });
  }

}

export default VersionsReducer;
