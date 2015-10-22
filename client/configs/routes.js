import loadArticleAction from '../actions/loadArticleAction';
import TutorialStore from '../stores/TutorialStore';
import { getPlatformName, getTechTitle } from '../util/tutorials';

export default {
    home: {
        path: process.env.BASE_URL + '/',
        method: 'get',
        page: 'home',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
          context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: process.env.SITE_TITLE
          });
          done();
        }
    },
    apptype: {
        path: process.env.BASE_URL + '/quickstart/:apptype',
        method: 'get',
        page: 'apptype',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType });
          context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: `${getPlatformName(appType)} Quickstarts`
          });
          done();
        }
    },
    backend: {
      path: process.env.BASE_URL + '/quickstart/backend/:tech1',
      method: 'get',
      page: 'backend',
      handler: require('../components/TutorialPage'),
      action: (context, payload) => {
        var appType = 'backend';
        var tech1 = payload.get('params').get('tech1');
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
        var quickstart = context.getStore(TutorialStore).getQuickstart();
        context.dispatch('UPDATE_PAGE_TITLE', {
          pageTitle: `${getTechTitle(quickstart, appType, tech1)} Quickstarts`
        });
        return context.executeAction(loadArticleAction, {
          appType: appType,
          tech1: tech1,
          currentTech: tech1
        });
      }
    },
    tech1: {
        path: process.env.BASE_URL + '/quickstart/:apptype/:tech1',
        method: 'get',
        page: 'tech1',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
          var quickstart = context.getStore(TutorialStore).getQuickstart();
          context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: `${getTechTitle(quickstart, appType, tech1)} Quickstarts`
          });
          done();
        }
    },
    tech2: {
        path: process.env.BASE_URL + '/quickstart/:apptype/:tech1/:tech2',
        method: 'get',
        page: 'tech2',
        handler: require('../components/TutorialPage'),
        action: (context, payload) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          var tech2 = payload.get('params').get('tech2');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1, tech2: tech2 });
          var quickstart = context.getStore(TutorialStore).getQuickstart();
          context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: `${getTechTitle(quickstart, appType, tech1)} + ${getTechTitle(quickstart, 'backend', tech2)} Quickstart`
          });
          var actions = [
            context.executeAction(loadArticleAction, {
              appType: appType,
              tech1: tech1,
              tech2: tech2,
              currentTech: tech1
            })
          ];
          if (tech2 !== 'no-api') {
            actions.push(
              context.executeAction(loadArticleAction, {
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
