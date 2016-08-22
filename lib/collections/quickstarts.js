import articlesCollection from './articles';
import platforms from '../data/platforms';
import appTypes from '../data/app-types';
import _ from 'lodash';

let quickstarts = {};
appTypes.forEach(appType => {
  let quickstart = _.clone(appType);

  quickstart.platforms = _.fromPairs(_.map(platforms[appType.name], platform => {
    let meta = {
      name: platform.name,
      title: platform.title,
      description: platform.description,
      url: platform.url,
      image: platform.image,
      articles: platform.articles
    };
    return [platform.name, meta];
  }));

  quickstarts[appType.name] = quickstart;
});

export default quickstarts;
