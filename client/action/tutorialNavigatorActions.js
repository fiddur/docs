import { TutorialStore, loadArticleAction } from 'auth0-tutorial-navigator';
import { getPageMetadata } from '../util/metadata';

export default {

  home: function(context) {
    context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
    return Promise.all([
      getPageMetadata().then(metadata => {
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      }),
    ]);
  },

  quickstartList: function(context) {
    context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
    return Promise.all([
      getPageMetadata().then(metadata => {
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      }),
    ]);
  },

  quickstart: function(context, payload) {
    let {quickstartId} = payload.params;
    let quickstarts = context.getStore(TutorialStore).getQuickstarts();
    return Promise.all([
      getPageMetadata(quickstarts, quickstartId).then(metadata => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {quickstartId});
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      }),
    ]);
  },

  platform: function(context, payload) {
    let {quickstartId, platformId} = payload.params;
    let quickstarts = context.getStore(TutorialStore).getQuickstarts();
    return Promise.all([
      getPageMetadata(quickstarts, quickstartId, platformId).then(metadata => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {quickstartId, platformId});
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      }),
      context.executeAction(loadArticleAction, {quickstartId, platformId})
    ]);
  },

  article: function(context, payload) {
    let {quickstartId, platformId, articleId} = payload.params;
    let quickstarts = context.getStore(TutorialStore).getQuickstarts();
    return Promise.all([
      getPageMetadata(quickstarts, quickstartId, platformId, articleId).then(metadata => {
        context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {quickstartId, platformId, articleId});
        context.dispatch('UPDATE_PAGE_METADATA', metadata);
      }),
      context.executeAction(loadArticleAction, {quickstartId, platformId, articleId})
    ]);
  }

};
