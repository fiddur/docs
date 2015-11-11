import { TutorialStore, loadArticleAction } from 'auth0-tutorial-navigator';
import { getQuickstartMetdata } from '../util/tutorials';

export default {
  home: {
    path: '/docs',
    method: 'get',
    page: 'home',
    handler: require('../components/Home'),
    action: (context, payload) => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
      return getQuickstartMetdata().then((metadata) => {
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      });
    }
  },
  apptype: {
    path: '/docs/quickstart/:apptype',
    method: 'get',
    page: 'apptype',
    handler: require('../components/Home'),
    action: (context, payload) => {
      var appType = payload.get('params').get('apptype');
      return getQuickstartMetdata(null, appType).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
          appType: appType
        });
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      });
    }
  },
  backend: {
    path: '/docs/quickstart/:apptype(backend|webapp)/:tech1',
    method: 'get',
    page: 'singletech',
    handler: require('../components/TutorialPage'),
    action: (context, payload) => {
      var appType = payload.get('params').get('apptype');
      var tech1 = payload.get('params').get('tech1');
      var quickstart = context.getStore(TutorialStore).getQuickstart();
      var basePath = context.getStore(TutorialStore).getBaseUrl()
      return Promise.all([
        getQuickstartMetdata(quickstart, appType, tech1).then((metadata) => {
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
            appType: appType,
            tech1: tech1
          });
          context.dispatch('UPDATE_PAGE_METADATA', metadata);
        }),
        context.executeAction(loadArticleAction, {
          baseUrl: basePath,
          appType: appType,
          tech1: tech1,
          currentTech: tech1
        })
      ]);
    }
  },
  tech1: {
    path: '/docs/quickstart/:apptype/:tech1',
    method: 'get',
    page: 'tech1',
    handler: require('../components/Home'),
    action: (context, payload) => {
      var appType = payload.get('params').get('apptype');
      var tech1 = payload.get('params').get('tech1');
      var quickstart = context.getStore(TutorialStore).getQuickstart();
      return getQuickstartMetdata(quickstart, appType, tech1).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
          appType: appType,
          tech1: tech1
        });
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      });
    }
  },
  tech2: {
    path: '/docs/quickstart/:apptype/:tech1/:tech2',
    method: 'get',
    page: 'tech2',
    handler: require('../components/TutorialPage'),
    action: (context, payload) => {
      var appType = payload.get('params').get('apptype');
      var tech1 = payload.get('params').get('tech1');
      var tech2 = payload.get('params').get('tech2');
      var quickstart = context.getStore(TutorialStore).getQuickstart();
      var basePath = context.getStore(TutorialStore).getBaseUrl()
      var actions = [
        getQuickstartMetdata(quickstart, appType, tech1, tech2).then((metadata) => {
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
            appType: appType,
            tech1: tech1,
            tech2: tech2
          });
          context.dispatch('UPDATE_PAGE_METADATA', metadata);
        }),
        context.executeAction(loadArticleAction, {
          baseUrl: basePath,
          appType: appType,
          tech1: tech1,
          tech2: tech2,
          currentTech: tech1
        })
      ];
      if (tech2 !== 'no-api') {
        actions.push(
          context.executeAction(loadArticleAction, {
            baseUrl: basePath,
            appType: 'backend',
            tech1: tech1,
            tech2: tech2,
            currentTech: tech2
          })
        );
      }
      return Promise.all(actions);
    }
  }
};
