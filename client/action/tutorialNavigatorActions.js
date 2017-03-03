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
  const selected = { quickstartId };
  return Promise.all([
    getPageMetadata(quickstarts, selected).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', selected);
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    })
  ]);
};

TutorialNavigatorActions.platform = (context, payload) => {
  const { params } = payload;
  const isFramedMode = context.getStore(ApplicationStore).isFramedMode();
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  const url = getQuickstartDocumentUrl(quickstarts, params, isFramedMode);
  return Promise.all([
    getPageMetadata(quickstarts, params).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', params);
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadDocument, { url })
  ]);
};

TutorialNavigatorActions.article = (context, payload) => {
  const { params } = payload;
  const isFramedMode = context.getStore(ApplicationStore).isFramedMode();
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  const url = getQuickstartDocumentUrl(quickstarts, params, isFramedMode);
  return Promise.all([
    getPageMetadata(quickstarts, params).then(metadata => {
      context.dispatch('QUICKSTART_SELECTED', params);
      context.dispatch('UPDATE_PAGE_METADATA', metadata);
    }),
    context.executeAction(loadDocument, { url })
  ]);
};

export default TutorialNavigatorActions;
