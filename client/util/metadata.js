import _ from 'lodash';
import strings from '../../lib/strings';

export function getQuickstartMetadata(quickstarts, appType, platform) {
  return new Promise((resolve, reject) => {
    if (appType && !quickstarts[appType]) {
      var err = new Error('Invalid AppType.');
      err.statusCode = 404;
      return reject(err);
    }

    var meta = {};
    if (appType && platform) {
      let title = quickstarts[appType].platforms[platform].title;
      if (!title) {
        var err = new Error('Invalid platform.');
        err.statusCode = 404;
        return reject(err);
      }
      meta.pageTitle = `${title} Quickstarts`;
      meta.pageDescription = `Learn how to quickly add authentication to your ${title} app. Authenticate with any social or enterprise identity provider.`;
    }
    else if (appType) {
      let name = quickstarts[appType].name
      meta.pageTitle = `${name} Quickstarts`;
      meta.pageDescription = `Browse ${name.toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`;
    }
    else {
      meta.pageTitle = strings.SITE_TITLE;
    }
    
    return resolve(meta);
  });
}

export function getCanonicalUrl(state) {
  let {quickstarts, appType, platform, article} = state;
  let tokens = ['/docs'];
  if (appType)  tokens.push(quickstarts[appType].slug);
  if (platform) tokens.push(platform);
  if (article)  tokens.push(article);
  return tokens.join('/');
}
