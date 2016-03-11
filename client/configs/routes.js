import tutorialNavigatorActions from '../action/tutorialNavigatorActions';

export default {
  home: {
    path: '/docs',
    method: 'get',
    page: 'home',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.home
  },
  quickstart: {
    path: '/docs/quickstart',
    method: 'get',
    page: 'quickstart',
    handler: require('../components/Home'),
  },
  apptype: {
    path: '/docs/quickstart/:apptype',
    method: 'get',
    page: 'apptype',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.appType
  },
  backend: {
    path: '/docs/quickstart/:apptype(backend|webapp)/:tech1',
    method: 'get',
    page: 'singletech',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.backend
  },
  tech1: {
    path: '/docs/quickstart/:apptype/:tech1',
    method: 'get',
    page: 'tech1',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.tech1
  },
  tech2: {
    path: '/docs/quickstart/:apptype/:tech1/:tech2',
    method: 'get',
    page: 'tech2',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.tech2
  }
};
