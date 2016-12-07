import tutorialNavigatorActions from '../action/tutorialNavigatorActions';
import loadCards from '../action/loadCards';
import loadDocument from '../action/loadDocument';
import loadQuickstarts from '../action/loadQuickstarts';
import HomePage from '../components/pages/HomePage';
import StaticPage from '../components/pages/StaticPage';
import ArticlePage from '../components/pages/ArticlePage';
import SearchPage from '../components/pages/SearchPage';
import QuickstartsPage from '../components/pages/QuickstartsPage';
import TutorialPage from '../components/pages/TutorialPage';
import AuthApiPage from '../components/pages/AuthApiPage';

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
    handler: QuickstartsPage,
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

  updateList: {
    path: '/docs/updates',
    method: 'get',
    handler: StaticPage
  },

  update: {
    path: '/docs/updates*',
    method: 'get',
    handler: StaticPage
  },

  mgmtApiExplorerV2: {
    path: '/docs/api/management/v2',
    method: 'get',
    handler: AuthApiPage
    /* action: (context, payload) => {
      const env = { fullWidth: true };
      return Promise.all([
        updateEnvironment(context, { env }),
        loadContent(context, payload)
      ]);
    }*/
  },

  authApiExplorer: {
    path: '/docs/api/authentication',
    method: 'get',
    handler: StaticPage
  },

  article: {
    path: '/docs/*',
    method: 'get',
    handler: ArticlePage,
    action: loadDocument
  }

};
