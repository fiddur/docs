import tutorialNavigatorActions from '../action/tutorialNavigatorActions';
import loadContent from '../action/loadContent';
import selectCategory from '../action/selectCategory';

export default {

  home: {
    path: '/docs',
    method: 'get',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.home
  },

  quickstarts: {
    path: '/docs/quickstarts',
    method: 'get',
    handler: require('../components/QuickstartsPage'),
    action: selectCategory,
    category: 'quickstarts'
  },

  quickstartAppType: {
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

  apis: {
    path: '/docs/api/info',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent,
    category: 'apis'
  },

  sdks: {
    path: '/docs/sdks',
    method: 'get',
    handler: require('../components/SdksPage'),
    action: selectCategory,
    category: 'sdks'
  },

  appliance: {
    path: '/docs/appliance',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent,
    category: 'appliance'
  },

  article: {
    path: '/docs/*',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent,
    category: 'articles'
  },

  error: {
    path: '/error',
    method: 'get',
    handler: require('../components/ErrorPage'),
    action: selectCategory,
    category: 'articles'
  }
  
};
