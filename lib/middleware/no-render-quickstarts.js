import url from 'url';
import quickstarts from '../data/quickstarts';
import _ from 'lodash';

export default function(req, res, next) {
  let pathname = url.parse(req.url).pathname;
  let i = _.findIndex(quickstarts.appTypes, function(appType) {
    return pathname.indexOf('/docs/' + appType.slug + '/') === 0;
  });
  
  // If the url is a quickstart and not json/jsonp set noRender
  if (i > -1 && !res.locals.jsonp && !res.locals.json) {
    res.locals.noRender = true;
  }
  return next();
}
