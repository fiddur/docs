import _ from 'lodash';

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
