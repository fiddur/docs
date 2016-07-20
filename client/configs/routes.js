import tutorialNavigatorActions from '../action/tutorialNavigatorActions';
import loadContent from '../action/loadContent';

export default {

  home: {
    path: '/docs',
    method: 'get',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.home
  },

  quickstart: {
    path: '/docs/quickstart/:quickstartId',
    method: 'get',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.quickstart
  },

  quickstartPlatform: {
    path: '/docs/quickstart/:quickstartId/:platformId',
    method: 'get',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.platform
  },

  quickstartArticle: {
    path: '/docs/quickstart/:quickstartId/:platformId/:articleId',
    method: 'get',
    handler: require('../components/TutorialPage'),
    action: tutorialNavigatorActions.article
  },

  document: {
    path: '/docs/*',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent,
    section: 'overview'
  }
  
};
