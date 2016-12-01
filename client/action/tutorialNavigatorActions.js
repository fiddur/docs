import TutorialStore from '../stores/TutorialStore';
import loadTutorial from './loadTutorial';
import { getPageMetadata } from '../util/metadata';

const TutorialNavigatorActions = {};

TutorialNavigatorActions.home = (context) => {
  context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
  return Promise.all([
    getPageMetadata().then(metadata => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.quickstartList = (context) => {
  context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {});
  return Promise.all([
    getPageMetadata().then(metadata => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.quickstart = (context, payload) => {
  const { quickstartId } = payload.params;
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId).then(metadata => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { quickstartId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.platform = (context, payload) => {
  const { quickstartId, platformId } = payload.params;
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId, platformId).then(metadata => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { quickstartId, platformId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadTutorial, { quickstartId, platformId })
  ]);
};

TutorialNavigatorActions.article = (context, payload) => {
  const { quickstartId, platformId, articleId } = payload.params;
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId, platformId, articleId).then(metadata => {
      context.dispatch('LOAD_TUTORIAL_NAVIGATOR', { quickstartId, platformId, articleId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadTutorial, { quickstartId, platformId, articleId })
  ]);
};

export default TutorialNavigatorActions;
