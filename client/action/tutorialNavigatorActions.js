import { TutorialStore, loadArticleAction } from 'auth0-tutorial-navigator';
import { getQuickstartMetadata } from '../util/metadata';

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
    let quickstarts = context.getStore(TutorialStore).getQuickstarts();
    return getQuickstartMetadata(quickstarts, appType).then((metadata) => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {appType});
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
      context.trackPage();
    });
  },
  
  article: function(context, payload) {
    let {appType, platform, article} = payload.params;
    let quickstarts = context.getStore(TutorialStore).getQuickstarts();
    return Promise.all([
      getQuickstartMetadata(quickstarts, appType, platform).then((metadata) => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {appType, platform, article});
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
        context.trackPage();
      }),
      context.executeAction(loadArticleAction, {appType, platform, article})
    ]);
  }

};
