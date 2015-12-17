import tutorialNavigatorActions from '../action/tutorialNavigatorActions';

export default {
  home: {
    path: '/docs',
    method: 'get',
    page: 'home',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.home
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
  },
  // product: {
  //   path: '/docs/product',
  //   method: 'get',
  //   page: 'product',
  //   handler: require('../components/CategorySectionPage'),
  // },
  sdks: {
    path: '/docs/sdks',
    method: 'get',
    page: 'sdk',
    handler: require('../components/CategorySectionPage'),
  },
  howTos: {
    path: '/docs/how-tos',
    method: 'get',
    page: 'how-to',
    handler: require('../components/CategorySectionPage'),
  }
};
