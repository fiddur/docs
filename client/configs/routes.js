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
  appType: {
    path: '/docs/quickstart/:appType',
    method: 'get',
    page: 'appType',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.appType
  },
  article: {
    path: '/docs/quickstart/:appType/:platform/:article',
    method: 'get',
    page: 'article',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.article
  }
};
