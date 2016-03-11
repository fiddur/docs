/**
 * Module dependencies.
 */
import articlesCollection from './articles';
import _ from 'lodash';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import nconf from 'nconf';

var quickstart = yaml.safeLoad(fs.readFileSync(path.join(nconf.get('DOCS_PATH'), './config/quickstart.yml')));

/**
 * Filters hybrid platforms out of native platforms
 *
 * @param {Object} platform
 * @return {Boolean}
 * @private
 */

function hybridFilter(platform) {
  return !!platform.hybrid;
}

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
  return result.sort(function(a, b) {
    var titleA = a.title.toUpperCase();
    var titleB = b.title.toUpperCase();
    return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
  });
}

exports.apptypes = quickstart.apptypes;
exports.clientPlatforms = convert(_.find(articlesCollection.items, { hash: 'client-platforms' }));
exports.nativePlatforms = convert(_.find(articlesCollection.items, { hash: 'native-platforms' }));
exports.hybridPlatforms = exports.nativePlatforms.filter(hybridFilter);
exports.serverPlatforms = convert(_.find(articlesCollection.items, { hash: 'server-platforms' }));
exports.serverApis = convert(_.find(articlesCollection.items, { hash: 'server-apis' }));
