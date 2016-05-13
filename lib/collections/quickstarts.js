import articlesCollection from './articles';
import platforms from '../platforms';
import _ from 'lodash';
import fs from 'fs'
import path from 'path';
import yaml from 'js-yaml';
import d from 'debug';

let debug = d('docs:quickstarts');
// TODO: Using the YAML loader would simplify this and remove some duplication
let {appTypes} = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/quickstart.yml')));

let quickstarts = {};
appTypes.forEach(appType => {
  let quickstart = _.clone(appType);
  
  quickstart.platforms = _.map(platforms[appType.name], platform => {
    let doc = _.find(articlesCollection, {hash: platform.name});
    debug(doc);
    return {
      name: platform.name,
      title: platform.title,
      image: platform.image,
      articles: platform.articles
    };
  });
  
  quickstarts[appType.name] = quickstart;
});

export default quickstarts;
