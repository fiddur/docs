import loadArticleAction from '../actions/loadArticleAction';

export default {
    home: {
        path: process.env.BASE_URL + '/',
        method: 'get',
        page: 'home',
        title: 'Home',
        handler: require('../components/Home'),
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
        handler: require('../components/Home'),
        action: (context, payload, done) => {
          var appType = payload.get('params').get('apptype');
          context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType });
          //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
          done();
        }
    },
    backend: {
      path: process.env.BASE_URL + '/quickstart/backend/:tech1',
      method: 'get',
      page: 'backend',
      title: 'Home',
      handler: require('../components/TutorialPage'),
      action: (context, payload) => {
        var appType = 'backend';
        var tech1 = payload.get('params').get('tech1');
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { appType: appType, tech1: tech1 });
        //context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: pageId + ' [Dynamic Page] | flux-examples | routing' });
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
        title: 'Home',
        handler: require('../components/Home'),
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
