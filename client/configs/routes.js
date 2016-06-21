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
    path: '/docs/quickstart/:quickstartId',
    method: 'get',
    page: 'quickstart',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.quickstart
  },
  platform: {
    path: '/docs/quickstart/:quickstartId/:platformId',
    method: 'get',
    page: 'article',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.platform
  },
  article: {
    path: '/docs/quickstart/:quickstartId/:platformId/:articleId',
    method: 'get',
    page: 'article',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.article
  }
};
