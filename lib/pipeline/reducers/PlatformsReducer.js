import assert from 'assert';
import fs from 'fs';
import { basename, dirname, resolve } from 'path';
import lsr from 'lsr';
import yaml from 'js-yaml';

const getPlatformIndexFiles = (path) =>
  lsr.sync(path)
  .filter(file => file.name === 'index.yml')
  .map(file => ({
    filename: file.fullPath,
    data: yaml.safeLoad(fs.readFileSync(file.fullPath, 'utf8'))
  }));

class PlatformsReducer {

  constructor(options = {}) {
    assert(options.appTypes, 'PlatformsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'PlatformsReducer constructor requires an articlesDir option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
  }

  reduce(cache) {
    const result = {};

    this.appTypes.forEach(appType => {
      const indexes = getPlatformIndexFiles(resolve(this.articlesDir, appType.slug));
      result[appType.name] = indexes.map(index => {
        const platform = Object.assign({}, index.data);
        const path = dirname(index.filename);

        platform.name = basename(path);
        platform.type = appType.name;
        platform.url = `/docs/quickstart/${platform.type}/${platform.name}`;

        if (!index.data.articles) {
          throw new Error(`The YAML file at ${index.filename} is invalid: Missing articles list.`);
        }

        const createArticleEntry = (name, pos) => {
          const filename = resolve(path, `${name}.md`);
          const doc = cache.getByFilename(filename);
          return {
            name,
            number: pos === false ? undefined : pos + 1,
            title: doc.meta.title,
            description: doc.meta.description,
            budicon: doc.meta.budicon,
            url: `${platform.url}/${name}`
          };
        };

        platform.articles = index.data.articles.map(createArticleEntry);

        if (index.data.default_article) {
          platform.defaultArticle = createArticleEntry(index.data.default_article, false);
        }

        return platform;
      });

      result[appType.name].sort((a, b) => a.name.localeCompare(b.name));
    });

    return result;
  }

}

export default PlatformsReducer;
