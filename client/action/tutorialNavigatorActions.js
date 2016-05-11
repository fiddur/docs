import { TutorialStore, loadArticleAction } from 'auth0-tutorial-navigator';
import { getQuickstartMetadata } from '../util/tutorials';

export default {

  home: function(context) {
    context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
    return getQuickstartMetadata().then((metadata) => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },

  appType: function(context, payload) {
    let {appType} = payload.params;
    return getQuickstartMetadata(null, appType).then((metadata) => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {appType});
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },
  
  article: function(context, payload) {
    let {appType, platform, article} = payload.params;
    var quickstart = context.getStore(TutorialStore).getQuickstart();
    return Promise.all([
      getQuickstartMetadata(quickstart, appType, platform).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {appType, platform, article});
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
        context.trackPage();
      }),
      context.executeAction(loadArticleAction, {appType, platform, article})
    ]);
  }

};
