/**
 * Module dependencies.
 */
var articlesCollection = require('./articles-collection').articles;
var _ = require('lodash');
var util = require('./utils');
var nconf = require('nconf');


var quickstart = util.loadYaml('../docs/quickstart.yml');

exports.apptypes = quickstart.apptypes;
exports.clientPlatforms = convert(_.find(articlesCollection.items, { hash: 'client-platforms' }));
exports.nativePlatforms = convert(_.find(articlesCollection.items, { hash: 'native-platforms' }));
exports.hybridPlatforms = exports.nativePlatforms.filter(hybridFilter);
exports.serverPlatforms = convert(_.find(articlesCollection.items, { hash: 'server-platforms' }));
exports.serverApis = convert(_.find(articlesCollection.items, { hash: 'server-apis' }));

/**
 * Filters hybrid platforms out of native platforms
 *
 * @param {Object} platform
 * @return {Boolean}
 * @private
 */

function hybridFilter(platform) {
  return !!platform.hybrid
};

/**
 * Converts an article to the format required by the quickstart APIs
 *
 * @param {Array} docs
 * @returns {Array} platforms
 * @private
 */

function convert(docs) {
  var result = [];
  for (var i = 0; i < docs.items.length; i++) {
    var doc = docs.items[i];
    var obj = {
      title: doc.name,
      name: doc.hash,
      url: doc.url,
      image: doc.image
    };
    if (doc.thirdParty !== undefined) {
      obj.thirdParty = doc.thirdParty;
    }
    if (doc.hybrid !== undefined) {
      obj.hybrid = doc.hybrid;
    }
    result.push(obj);
  }
  return result;
}
