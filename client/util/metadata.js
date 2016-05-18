import _ from 'lodash';
import strings from '../../lib/strings';

export function getPageMetadata(quickstarts, quickstartId, platformId, articleId) {
  return new Promise((resolve, reject) => {
    
    if (quickstartId && !quickstarts[quickstartId]) {
      var err = new Error('Invalid AppType.');
      err.statusCode = 404;
      return reject(err);
    }

    var meta = {};
    if (quickstartId && platformId) {
      let title = quickstarts[quickstartId].platforms[platformId].title;
      if (!title) {
        var err = new Error('Invalid platform.');
        err.statusCode = 404;
        return reject(err);
      }
      meta.pageTitle = `${title} Quickstarts`;
      meta.pageDescription = `Learn how to quickly add authentication to your ${title} app. Authenticate with any social or enterprise identity provider.`;
    }
    else if (quickstartId) {
      let title = quickstarts[quickstartId].title
      meta.pageTitle = `${title} Quickstarts`;
      meta.pageDescription = `Browse ${title.toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`;
    }
    else {
      meta.pageTitle = strings.SITE_TITLE;
    }
    
    return resolve(meta);
    
  });
}

export function getCanonicalUrl(state) {
  let {quickstarts, quickstartId, platformId, articleId} = state;
  let tokens = ['/docs'];
  if (quickstartId) tokens.push(quickstarts[quickstartId].slug);
  if (platformId)   tokens.push(platformId);
  if (articleId)    tokens.push(articleId);
  return tokens.join('/');
}
