import assert from 'assert';
import urljoin from 'url-join';
import { basename, dirname, resolve } from 'path';
import { getPlatformIndexFiles } from '../util';

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
      const indexes = getPlatformIndexFiles(resolve(this.articlesDir, appType.slug));

      // Create a platform entry using each index.yml file.
      indexes.forEach(index => {
        if (!index.data.articles) {
          throw new Error(`The YAML file at ${index.filename} is invalid: Missing articles list.`);
        }

        const platform = {
          name: index.name,
          title: index.data.title,
          // TODO: This should really use the UrlFormatter to return an absolute URL, but
          // some of the client-side code depends on this URL being relative.
          url: `/docs/quickstart/${appType.name}/${index.name}`,
          image: this.urlFormatter.format(index.data.image),
          third_party: index.data.thirdParty,
          community: index.data.community,
          maintainers: index.data.maintainers
        };

        const createArticleEntry = (name, pos) => {
          const filename = resolve(dirname(index.filename), `${name}.md`);
          const doc = cache.getByFilename(filename);
          return {
            name,
            number: pos === false ? undefined : pos + 1,
            title: doc.title,
            description: doc.description,
            budicon: doc.budicon,
            url: urljoin(platform.url, name)
          };
        };

        if (index.data.default_article) {
          platform.defaultArticle = createArticleEntry(index.data.default_article, false);
        }

        platform.articles = index.data.articles.map(createArticleEntry);
        platforms[platform.name] = platform;
      });
    });

    return result;
  }

}

export default QuickstartsReducer;
