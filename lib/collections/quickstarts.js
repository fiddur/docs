import articlesCollection from './articles';
import platforms from './platforms';
import _ from 'lodash';
import fs from 'fs'
import path from 'path';
import yaml from 'js-yaml';
import d from 'debug';

let debug = d('docs:quickstarts');
// TODO: Using the YAML loader would simplify this and remove the duplication with platforms.js
let {appTypes} = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/quickstart.yml')));

export default appTypes.map(appType => {
  
  let platformsWithArticles = platforms[appType.name].map(platform => {
    let obj = _.clone(platform);
    obj.articles = platform.articles.map(hash => _.find(articlesCollection, {hash}));
    return obj;
  });
  
  let quickstart = _.clone(appType);
  quickstart.platforms = platformsWithArticles;
  return quickstart;

});

/*
var quickstart = yaml.safeLoad(fs.readFileSync('./config/quickstart.yml'));

function convert(docs) {
  return _.map(docs.items, (platform) => {
    let articles = _.map(platform.items, (doc) => {
      let result = {
        order: doc.order || 1,
        title: doc.title,
        name: doc.hash,
        url: doc.url,
        image: doc.image
      };
      if (doc.thirdParty !== undefined) {
        result.thirdParty = doc.thirdParty;
      }
      debug("adding %o", result);
      return result;
    });
    return articles.sort((a, b) => a.order - b.order);
  });
}

exports.appTypes = quickstart.appTypes;
exports.nativePlatforms = convert(_.find(articlesCollection.items, { hash: 'x-native-platforms' }));
exports.webPlatforms = convert(_.find(articlesCollection.items, { hash: 'x-web-platforms' }));
exports.servicePlatforms = convert(_.find(articlesCollection.items, { hash: 'x-service-platforms' }));
*/