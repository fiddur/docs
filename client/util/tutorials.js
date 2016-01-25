import _ from 'lodash';
import strings from '../../lib/strings';

export function getPlatformName(platformType) {
  var options = {
    'spa': 'Single Page App',
    'native-mobile': 'Native Mobile App',
    'webapp': 'Regular Web Application',
    'hybrid': 'Hybrid Mobile App',
    'backend': 'Backend/API'
  };

  return options[platformType];
}

export function getQuestion(platformType) {
  platformType = platformType || 'none';
  var questions = {
    'none': 'Getting started? Try our quickstarts.',
    'spa': 'What technology will you use in the FrontEnd?',
    'native-mobile': 'Select a native SDK',
    'webapp': 'What technology are you using for your WebApp?',
    'hybrid': 'Select a Hybrid SDK',
    'backend': 'Select an API or Backend platform'
  };

  return questions[platformType];
}

export function getPlatformSlug(platformType) {
  var paths = {
    'spa': 'client-platforms',
    'native-mobile': 'native-platforms',
    'webapp': 'server-platforms',
    'hybrid': 'native-platforms',
    'backend': 'server-apis'
  };

  return paths[platformType];
}

export function getPlatformCollection(quickstart, platformType) {
  if(!platformType) {
    return [];
  }

  var options = {
    'spa': quickstart.clientPlatforms,
    'native-mobile': quickstart.nativePlatforms,
    'webapp': quickstart.serverPlatforms,
    'hybrid': quickstart.hybridPlatforms,
    'backend': quickstart.serverApis
  };

  return options[platformType];
}

export function getTechTitle(quickstart, appType, techName) {
  var collection = getPlatformCollection(quickstart, appType);

  var result = _.find(collection, { name: techName });

  if(result) {
    return result.title;
  }
}

export function getQuickstartMetdata(quickstart, appType, tech1, tech2) {
  return new Promise((resolve, reject) => {
    if (appType && !getPlatformSlug(appType)) {
      var err = new Error('nvalid AppType.');
      err.statusCode = 404;
      return reject(err);
    }

    var meta = {};
    if (appType && tech1 && tech2) {
      if (tech2 === 'no-api') {
        let title1 = getTechTitle(quickstart, appType, tech1);
        if (!title1) {
          var err = new Error('Invalid technology.');
          err.statusCode = 404;
          return reject(err);
        }
        meta.pageTitle = `${title1} Quickstart`;
        meta.pageDescription = `Learn how to quickly add authentication to your ${title1} app. Authenticate with any social or enterprise identity provider.`;
      } else {
        let title1 = getTechTitle(quickstart, appType, tech1);
        let title2 = getTechTitle(quickstart, 'backend', tech2);
        if (!title1 || !title2) {
          var err = new Error('Invalid technology.');
          err.statusCode = 404;
          return reject(err);
        }
        meta.pageTitle = `${title1} + ${title2} Quickstart`;
        meta.pageDescription = `Learn how to quickly add authentication to your ${title1} app that connects to ${title2}. Authenticate with any social or enterprise identity provider.`;
      }

    } else if (appType && tech1) {
      let title1 = getTechTitle(quickstart, appType, tech1);
      if (!title1) {
        var err = new Error('Invalid technology.');
        err.statusCode = 404;
        return reject(err);
      }
      meta.pageTitle = `${title1} Quickstarts`;
      meta.pageDescription =  `Learn how to quickly add authentication to your ${title1} app. Authenticate with any social or enterprise identity provider.`;
    } else if (appType) {
      meta.pageTitle = `${getPlatformName(appType)} Quickstarts`;
      meta.pageDescription = `Browse ${getPlatformName(appType).toLowerCase()} quickstarts to learn how to quickly add authentication to your app.`;
    } else {
      meta.pageTitle = strings.SITE_TITLE;
    }
    return resolve(meta);
  });
}