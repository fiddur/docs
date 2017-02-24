import assert from 'assert';
import urljoin from 'url-join';
import { basename, dirname, join, resolve } from 'path';
import { findMetadataFiles } from '../util';

/**
 * Transforms a Cache into a map containing information about all of the Quickstarts that
 * have been defined. For each app type directory, it recursively scans for index.yml
 * files that represent each platform. Then, it reads metadata from the documents described
 * by the index file and adds an array of articles to each platform. This information is
 * used by the TutorialNavigator on the client to build the interactive menu of Quickstarts.
 */
class QuickstartsReducer {

  /**
   * Creates an instance of QuickstartsReducer.
   * @param {Object} options - An options hash.
   * @param {Array<Object>} [options.appTypes] - An array of app types for Quickstarts.
   * @param {String} [options.articlesDir] - The base directory for articles.
   * @param {UrlFormatter} [options.urlFormatter] - The UrlFormatter instance to use.
   */
  constructor(options = {}) {
    assert(options.appTypes, 'QuickstartsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'QuickstartsReducer constructor requires an articlesDir option');
    assert(options.urlFormatter, 'QuickstartsReducer constructor requires a urlFormatter option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.urlFormatter = options.urlFormatter;
  }

  /**
   * Given a Cache, returns an object describing the platforms with Quickstarts, and a subset
   * of the metadata contained in their articles.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Object} An object representing the Quickstart information.
   */
  reduce(cache) {
    const result = {};

    this.appTypes.forEach(appType => {
      const platforms = {};

      // Add an entry with the platform hash and the metadata read from the appType.
      result[appType.name] = Object.assign({}, appType, { platforms });

      // Recursively scan the articles directory to find all index.yml files.
      const path = resolve(this.articlesDir, 'quickstart', appType.name);
      const indexes = findMetadataFiles(path, 'index.yml');

      // Create a platform entry using each index.yml file.
      indexes.forEach(index => {
        const { name, data, filename } = index;

        if (!data.articles) {
          throw new Error(`The YAML file at ${filename} is invalid: Missing articles list.`);
        }

        const platform = {
          name,
          title: data.title,
          url: this.urlFormatter.format(`quickstart/${appType.name}/${name}`),
          image: this.urlFormatter.format(data.image),
          third_party: data.thirdParty,
          community: data.community,
          maintainers: data.maintainers
        };

        const createArticleEntry = (hash, pos, subpath = '') => {
          const articleFilename = resolve(path, platform.name, subpath, `${hash}.md`);
          const doc = cache.getByFilename(articleFilename);
          return {
            name: hash,
            number: pos === null ? undefined : pos + 1,
            title: doc.title,
            description: doc.description,
            budicon: doc.budicon,
            url: urljoin(platform.url, subpath, hash)
          };
        };

        if (data.default_article) {
          platform.defaultArticle = createArticleEntry(data.default_article, null);
        }

        platform.articles = data.articles.map((hash, pos) => createArticleEntry(hash, pos));

        if (data.previous_versions) {
          platform.previousVersions = {};
          Object.keys(data.previous_versions).forEach(versionName => {
            const version = data.previous_versions[versionName];
            platform.previousVersions[versionName] = {
              name: versionName,
              title: version.title,
              articles: version.articles.map((hash, pos) => createArticleEntry(hash, pos, versionName))
            };
          });
        }

        platforms[platform.name] = platform;
      });
    });

    return result;
  }

}

export default QuickstartsReducer;
