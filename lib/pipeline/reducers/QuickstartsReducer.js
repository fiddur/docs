import assert from 'assert';
import urljoin from 'url-join';
import { basename, dirname, resolve } from 'path';
import { getPlatformIndexFiles } from '../util';

class QuickstartsReducer {

  constructor(options = {}) {
    assert(options.appTypes, 'QuickstartsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'QuickstartsReducer constructor requires an articlesDir option');
    assert(options.urlFormatter, 'QuickstartsReducer constructor requires a urlFormatter option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.urlFormatter = options.urlFormatter;
  }

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
        const platform = {
          name: index.name,
          type: appType.name,
          url: this.urlFormatter.format(`/quickstart/${appType.name}/${index.name}`)
        };

        if (!index.data.articles) {
          throw new Error(`The YAML file at ${index.filename} is invalid: Missing articles list.`);
        }

        const createArticleEntry = (name, pos) => {
          const filename = resolve(dirname(index.filename), `${name}.md`);
          const doc = cache.getByFilename(filename);
          return {
            name,
            number: pos === false ? undefined : pos + 1,
            title: doc.meta.title,
            description: doc.meta.description,
            budicon: doc.meta.budicon,
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
