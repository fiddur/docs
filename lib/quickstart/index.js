import quickstarts from '../collections/quickstarts';
import _ from 'lodash';
let debug = require('debug')('docs:quickstart');

let routes = [];
let addRoute = (route) => {
  routes.push(route);
  debug('loaded route %s', route);
};

_.values(quickstarts).forEach(quickstart => {
  let baseRoute = '/' + quickstart.name;
  addRoute(baseRoute);
  quickstart.platforms.forEach(platform => {
    let platformRoute = baseRoute + '/' + platform.name;
    addRoute(platformRoute);
    platform.articles.forEach(article => {
      let articleRoute = platformRoute + '/' + article;
      addRoute(articleRoute);
    });
  });
});

export default quickstarts;
export { routes };
