import tutorialNavigatorActions from '../action/tutorialNavigatorActions';
import loadContent from '../action/loadContent';
import loadCards from '../action/loadCards';
import loadPlatforms from '../action/loadPlatforms';
import loadQuickstarts from '../action/loadQuickstarts';
import updateEnvironment from '../action/updateEnvironment';
import HomePage from '../components/Home';
import StaticPage from '../components/StaticPage';
import ArticlePage from '../components/ArticlePage';
import SearchPage from '../components/SearchPage';
import TutorialPage from '../components/TutorialPage';
import QuickstartsPage from '../components/QuickstartsPage';
import AuthApiPage from '../components/AuthApiPage';

export default {

  home: {
    path: '/docs/',
    method: 'get',
    handler: HomePage,
    action: (context, payload) =>
      Promise.all([
        loadQuickstarts(context, payload).then(() =>
          tutorialNavigatorActions.home(context, payload)
        ),
        loadCards(context, payload)
      ])
  },

  quickstarts: {
    path: '/docs/quickstarts',
    method: 'get',
    handler: QuickstartsPage,
    action: (context, payload) =>
      loadQuickstarts(context, payload).then(() =>
        tutorialNavigatorActions.quickstartList(context, payload)
      )
  },

  quickstartAppType: {
    path: '/docs/quickstart/:quickstartId',
    method: 'get',
    handler: HomePage,
    action: (context, payload) =>
      loadQuickstarts(context, payload).then(() =>
        tutorialNavigatorActions.quickstart(context, payload)
      )
  },

  quickstartPlatform: {
    path: '/docs/quickstart/:quickstartId/:platformId',
    method: 'get',
    handler: TutorialPage,
    action: (context, payload) =>
      loadQuickstarts(context, payload).then(() =>
        tutorialNavigatorActions.platform(context, payload)
      )
  },

  quickstartArticle: {
    path: '/docs/quickstart/:quickstartId/:platformId/:articleId',
    method: 'get',
    handler: TutorialPage,
    action: (context, payload) =>
      loadQuickstarts(context, payload).then(() =>
        tutorialNavigatorActions.article(context, payload)
      )
  },

  search: {
    path: '/docs/search',
    method: 'get',
    handler: SearchPage
  },

  // sdks: {
  //   path: '/docs/sdks',
  //   method: 'get',
  //   handler: require('../components/SdksPage'),
  //   action: loadPlatforms
  // },

  updates: {
    path: '/docs/updates',
    method: 'get',
    handler: StaticPage
  },

  mgmtApiExplorerV2: {
    path: '/docs/api/management/v2',
    method: 'get',
    handler: StaticPage
  },

  authApiExplorerLegacy: {
    path: '/docs/api/authentication',
    method: 'get',
    handler: StaticPage
  },

  authApiExplorer: {
    path: '/docs/api/authentication/reference',
    method: 'get',
    handler: AuthApiPage,
    action: (context, payload) => {
      const env = { fullWidth: true };
      return Promise.all([
        updateEnvironment(context, { env }),
        loadContent(context, payload)
      ]);
    }
  },

  updates: {
    path: '/docs/updates*',
    method: 'get',
    handler: StaticPage
  },

  article: {
    path: '/docs/*',
    method: 'get',
    handler: ArticlePage,
    action: loadContent
  }

};
