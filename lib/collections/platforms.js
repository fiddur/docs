import platforms from '../data/platforms'
import _ from 'lodash';
import debug from 'debug';

const debugClient = debug('docs:platforms');
/**
 * This converts the list of platforms to a single array, and formats it for use in SEO.
 */

let allPlatforms = [];
_.keys(platforms).forEach(appType => {

  // TODO: Ensure the result generated here matches the existing contract
  platforms[appType].forEach(platform => {
    if (!platform.title) {
      debugClient(platform);
      throw new Error('Invalid platform. Title is required.');
    }
    allPlatforms.push({
      name: platform.title,
      description: platform.description,
      hash: platform.name,
      platform_type: appType,
      url: platform.url, // TODO: Can we generate this?
      image: platform.image,
      thirdParty: platform.thirdParty,
      snippets: platform.snippets,
      alias: platform.alias
    });
  });

});

export default allPlatforms.sort((a, b) => a.name.toUpperCase() - b.name.toUpperCase());
