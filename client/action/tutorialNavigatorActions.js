import { TutorialStore, loadArticleAction } from 'auth0-tutorial-navigator';
import { getQuickstartMetdata } from '../util/tutorials';

export default {

  home: function(context) {
    context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
    return getQuickstartMetdata().then((metadata) => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },

  appType: function(context, payload) {
    var appType = payload.params.apptype;
    return getQuickstartMetdata(null, appType).then((metadata) => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
        appType: appType
      });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },

  backend: function(context, payload) {
    var appType = payload.params.apptype;
    var tech1 = payload.params.tech1;
    var quickstart = context.getStore(TutorialStore).getQuickstart();
    return Promise.all([
      getQuickstartMetdata(quickstart, appType, tech1).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
          appType: appType,
          tech1: tech1
        });
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
        context.trackPage();
      }),
      context.executeAction(loadArticleAction, {
        appType: appType,
        tech1: tech1,
        currentTech: tech1
      })
    ]);
  },

  tech1: function(context, payload) {
    var appType = payload.params.apptype;
    var tech1 = payload.params.tech1;
    var quickstart = context.getStore(TutorialStore).getQuickstart();
    return getQuickstartMetdata(quickstart, appType, tech1).then((metadata) => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
        appType: appType,
        tech1: tech1
      });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },

  tech2: function(context, payload) {
    var appType = payload.params.apptype;
    var tech1 = payload.params.tech1;
    var tech2 = payload.params.tech2;
    var quickstart = context.getStore(TutorialStore).getQuickstart();
    var actions = [
      getQuickstartMetdata(quickstart, appType, tech1, tech2).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
          appType: appType,
          tech1: tech1,
          tech2: tech2
        });
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
        context.trackPage();
      }),
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

};
