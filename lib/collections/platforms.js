/**
 * Module dependencies.
 */
import articlesCollection from './articles';
import _ from 'lodash';
import nconf from 'nconf';

var platforms = [];

/**
 * Adds an article to the platforms collection
 *
 * @param {Array} docs
 * @private
 */

function addToPlatforms(docs, platformType) {
  for (var i = 0; i < docs.items.length; i++) {
    var doc = docs.items[i];
    var obj = {
      name: doc.name,
      hash: doc.hash,
      platform_type: platformType,
      url: doc.url,
      image: doc.image,
      thirdParty: doc.thirdParty,
      hybrid: doc.hybrid,
      snippets: doc.snippets,
      alias: doc.alias
    };

    // Add specific seo_alias for seo of auto generated pages eg: https://auth0.com/authenticate/
    if (doc.seo_alias) {
      obj.seo_alias = doc.seo_alias;
    }

    platforms.push(obj);
  }

}

addToPlatforms(_.find(articlesCollection.items, { hash: 'client-platforms' }), 'client-platform');
addToPlatforms(_.find(articlesCollection.items, { hash: 'native-platforms' }), 'native-platform');
addToPlatforms(_.find(articlesCollection.items, { hash: 'server-platforms' }), 'server-platform');
addToPlatforms(_.find(articlesCollection.items, { hash: 'server-apis' }), 'server-api');

export default platforms.sort(function(a, b) {
  var nameA = a.name.toUpperCase();
  var nameB = b.name.toUpperCase();
  return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
});
