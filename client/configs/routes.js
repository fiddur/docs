import tutorialNavigatorActions from '../action/tutorialNavigatorActions';
import loadContent from '../action/loadContent';
import selectSection from '../action/selectSection';

export default {

  home: {
    path: '/docs/',
    method: 'get',
    handler: require('../components/Home'),
    action: tutorialNavigatorActions.home
  },

  quickstarts: {
    path: '/docs/quickstarts',
    method: 'get',
    handler: require('../components/QuickstartsPage'),
    action: tutorialNavigatorActions.quickstartList
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

  search: {
    path: '/docs/search',
    method: 'get',
    handler: require('../components/SearchPage'),
    action: selectSection,
    section: 'articles'
  },

  apis: {
    path: '/docs/api/info',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent
  },

  sdks: {
    path: '/docs/sdks',
    method: 'get',
    handler: require('../components/SdksPage'),
    action: selectSection,
    section: 'sdks'
  },

  article: {
    path: '/docs/*',
    method: 'get',
    handler: require('../components/ArticlePage'),
    action: loadContent
  }

};
