import _ from 'lodash';
import strings from '../../lib/strings';

export function getPlatformName(platformType) {
  var options = {
    'native': 'Native App',
    'web': 'Web Application',
    'service': 'Backend Service'
  };

  return options[platformType];
}

export function getQuestion(platformType) {
  platformType = platformType || 'none';
  var questions = {
    'none': 'Getting started? Try our quickstarts.',
    'native': 'Select a native SDK',
    'web': 'What technology are you using for your web app?',
    'service': 'Select an API or Backend platform'
  };

  return questions[platformType];
}

export function getPlatformSlug(platformType) {
  var paths = {
    'native': 'x-native-platforms',
    'web': 'x-web-platforms',
    'service': 'x-service-platforms'
  };

  return paths[platformType];
}

export function getPlatformCollection(quickstart, platformType) {
  if (!platformType) {
    return [];
  }

  var options = {
    'native': quickstart.nativePlatforms,
    'web': quickstart.webPlatforms,
    'service': quickstart.servicePlatforms
  };

  return options[platformType];
}

export function getPlatformTitle(quickstart, appType, platformName) {
  var collection = getPlatformCollection(quickstart, appType);
  var result = _.find(collection, { name: platformName });
  return result && result.title;
}

export function getQuickstartMetadata(quickstart, appType, platform) {
  return new Promise((resolve, reject) => {
    if (appType && !getPlatformSlug(appType)) {
      var err = new Error('Invalid AppType.');
      err.statusCode = 404;
      return reject(err);
    }

    var meta = {};
    if (appType && platform) {
      let title = getPlatformTitle(quickstart, appType, platform);
      if (!title) {
        var err = new Error('Invalid platform.');
        err.statusCode = 404;
        return reject(err);
      }
      meta.pageTitle = `${title} Quickstarts`;
      meta.pageDescription =  `Learn how to quickly add authentication to your ${title} app. Authenticate with any social or enterprise identity provider.`;
    }
    else if (appType) {
      meta.pageTitle = `${getPlatformName(appType)} Quickstarts`;
      meta.pageDescription = `Browse ${getPlatformName(appType).toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`;
    }
    else {
      meta.pageTitle = strings.SITE_TITLE;
    }
    
    return resolve(meta);
  });
}

export function getCanonicalUrl(appType, platform, article) {
  let tokens = ['/docs'];
  if (appType)  tokens.push(getPlatformSlug(appType));
  if (platform) tokens.push(platform);
  if (article)  tokens.push(article);
  return tokens.join('/');
}
