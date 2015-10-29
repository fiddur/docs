import loadArticleAction from '../actions/loadArticleAction';
import TutorialStore from '../stores/TutorialStore';
import { getQuickstartMetdata } from '../util/tutorials';
import {navigateAction} from 'fluxible-router';

var baseUrl = '';
if (typeof window !== 'undefined') {
  baseUrl = window.CONFIG.baseUrl;
} else {
  baseUrl = process.env.BASE_URL;
}

export default {
    home: {
        path: `${baseUrl}/`,
        method: 'get',
        page: 'home',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
          context.dispatch('UPDATE_PAGE_METADATA', getQuickstartMetdata());
          done();
        }
    },
    apptype: {
        path: `${baseUrl}/quickstart/:apptype`,
        method: 'get',
        page: 'apptype',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType });
          context.dispatch('UPDATE_PAGE_METADATA', getQuickstartMetdata(null, appType));
          done();
        }
    },
    backend: {
      path: `${baseUrl}/quickstart/:apptype(backend|webapp)/:tech1`,
      method: 'get',
      page: 'singletech',
      handler: require('../components/TutorialPage'),
      action: (context, payload) => {
        var appType = payload.get('params').get('apptype');
        var tech1 = payload.get('params').get('tech1');
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
        var quickstart = context.getStore(TutorialStore).getQuickstart();
        context.dispatch('UPDATE_PAGE_METADATA', getQuickstartMetdata(quickstart, appType, tech1));
        return context.executeAction(loadArticleAction, {
          appType: appType,
          tech1: tech1,
          currentTech: tech1
        });
      }
    },
    tech1: {
        path: `${baseUrl}/quickstart/:apptype/:tech1`,
        method: 'get',
        page: 'tech1',
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
          var quickstart = context.getStore(TutorialStore).getQuickstart();
          context.dispatch('UPDATE_PAGE_METADATA', getQuickstartMetdata(quickstart, appType, tech1));
          done();
        }
    },
    tech2: {
        path: `${baseUrl}/quickstart/:apptype/:tech1/:tech2`,
        method: 'get',
        page: 'tech2',
        handler: require('../components/TutorialPage'),
        action: (context, payload) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          var tech2 = payload.get('params').get('tech2');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1, tech2: tech2 });
          var quickstart = context.getStore(TutorialStore).getQuickstart();
          context.dispatch('UPDATE_PAGE_METADATA', getQuickstartMetdata(quickstart, appType, tech1, tech2));
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
