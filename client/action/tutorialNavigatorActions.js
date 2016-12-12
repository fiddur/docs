import ApplicationStore from '../stores/ApplicationStore';
import QuickstartStore from '../stores/QuickstartStore';
import loadDocument from './loadDocument';
import getPageMetadata from '../util/getPageMetadata';
import getQuickstartDocumentUrl from '../util/getQuickstartDocumentUrl';

const TutorialNavigatorActions = {};

TutorialNavigatorActions.home = (context) => {
  context.dispatch('QUICKSTART_SELECTED', {});
  return Promise.all([
    getPageMetadata().then(metadata => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.quickstartList = (context) => {
  context.dispatch('QUICKSTART_SELECTED', {});
  return Promise.all([
    getPageMetadata().then(metadata => {
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.quickstart = (context, payload) => {
  const { quickstartId } = payload.params;
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', { quickstartId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.platform = (context, payload) => {
  const { quickstartId, platformId } = payload.params;
  const isFramedMode = context.getStore(ApplicationStore).isFramedMode();
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  const url = getQuickstartDocumentUrl(quickstarts, { quickstartId, platformId, isFramedMode });
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId, platformId).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', { quickstartId, platformId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadDocument, { url })
  ]);
};

TutorialNavigatorActions.article = (context, payload) => {
  const { quickstartId, platformId, articleId } = payload.params;
  const isFramedMode = context.getStore(ApplicationStore).isFramedMode();
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  const url = getQuickstartDocumentUrl(quickstarts, { quickstartId, platformId, articleId, isFramedMode });
  return Promise.all([
    getPageMetadata(quickstarts, quickstartId, platformId, articleId).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', { quickstartId, platformId, articleId });
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadDocument, { url })
  ]);
};

export default TutorialNavigatorActions;
