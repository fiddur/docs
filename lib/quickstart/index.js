import quickstarts from '../collections/quickstarts';
let debug = require('debug')('docs:quickstart');

let routes = [];
let addRoute = (route) => {
  routes.push(route);
  debug('loaded route %s', route);
};

quickstarts.forEach(quickstart => {
  let baseRoute = '/' + quickstart.name;
  addRoute(baseRoute);
  quickstart.platforms.forEach(platform => {
    let platformRoute = baseRoute + '/' + platform.name;
    addRoute(platformRoute);
  });
});

export default quickstarts;
export { routes };
