import assert from 'assert';
import { flatten } from 'lodash';
import { basename, dirname, resolve } from 'path';
import { getPlatformIndexFiles } from '../util';

class PlatformsReducer {

  constructor(options = {}) {
    assert(options.appTypes, 'PlatformsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'PlatformsReducer constructor requires an articlesDir option');
    assert(options.urlFormatter, 'PlatformsReducer constructor requires a urlFormatter option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.urlFormatter = options.urlFormatter;
  }

  reduce(cache) {
    // Build a list of all platforms in the system.
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

    platforms.sort((a, b) => a.name.localeCompare(b.name));
    return platforms;
  }

}

export default PlatformsReducer;
