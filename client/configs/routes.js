import loadArticleAction from '../actions/loadArticleAction';

export default {
    home: {
        path: process.env.BASE_URL + '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        handler: require('../components/TutorialNavigator'),
        action: (context, payload, done) => {
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
          //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
          done();
        }
    },
    apptype: {
        path: process.env.BASE_URL + '/quickstart/:apptype',
        method: 'get',
        page: 'apptype',
        title: 'Home',
        handler: require('../components/TutorialNavigator'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType });
          //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
          done();
        }
    },
    tech1: {
        path: process.env.BASE_URL + '/quickstart/:apptype/:tech1',
        method: 'get',
        page: 'tech1',
        title: 'Home',
        handler: require('../components/TutorialNavigator'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
          //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
          done();
        }
    },
    tech2: {
        path: process.env.BASE_URL + '/quickstart/:apptype/:tech1/:tech2',
        method: 'get',
        page: 'tech2',
        title: 'Home',
        handler: require('../components/TutorialPage'),
        action: (context, payload) => {
          var appType = payload.get('params').get('apptype');
          var tech1 = payload.get('params').get('tech1');
          var tech2 = payload.get('params').get('tech2');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1, tech2: tech2 });
          //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
          return Promise.all([
            context.executeAction(loadArticleAction, {
              appType: appType,
              tech1: tech1,
              tech2: tech2,
              currentTech: tech1
            }),
            context.executeAction(loadArticleAction, {
              appType: 'backend',
              tech1: tech1,
              tech2: tech2,
              currentTech: tech2
            })
          ]);
        }
    }
};
