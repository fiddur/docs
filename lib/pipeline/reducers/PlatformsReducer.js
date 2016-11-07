import assert from 'assert';
import { flatten } from 'lodash';
import { basename, dirname, resolve } from 'path';
import { getPlatformIndexFiles } from '../util';

/**
 * Transforms a Cache into an array of objects, each entry of which describes a platform
 * which has an associated Quickstart.
 */
class PlatformsReducer {

  /**
   * Creates an instance of PlatformsReducer.
   * @param {Object} options - An options hash.
   * @param {Array<Object>} [options.appTypes] - An array of app types for Quickstarts.
   * @param {String} [options.articlesDir] - The base directory for articles.
   * @param {UrlFormatter} [options.urlFormatter] - The UrlFormatter instance to use.
   */
  constructor(options = {}) {
    assert(options.appTypes, 'PlatformsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'PlatformsReducer constructor requires an articlesDir option');
    assert(options.urlFormatter, 'PlatformsReducer constructor requires a urlFormatter option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.urlFormatter = options.urlFormatter;
  }

  /**
   * Given a Cache, returns an array of items representing the list of platforms
   * for which a Quickstart exists.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Array<Object>} An array of platforms.
   */
  reduce(cache) {
    const platforms = flatten(this.appTypes.map(appType => {
      const indexes = getPlatformIndexFiles(resolve(this.articlesDir, appType.slug));
      return indexes.map(index => {
        const { name, data } = index;
        return {
          name: data.title,
          description: data.description,
          hash: name,
          platform_type: appType.name,
          url: this.urlFormatter.format(`/docs/quickstart/${appType.name}/${name}`),
          image: this.urlFormatter.format(data.image),
          thirdParty: data.thirdParty,
          snippets: data.snippets,
          alias: data.alias
        };
      });
    }));

    // Sort the list of platforms alphabetically by name.
    platforms.sort((a, b) => a.name.localeCompare(b.name));

    return platforms;
  }

}

export default PlatformsReducer;
