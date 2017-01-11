import { navigateAction } from 'fluxible-router';
import { format } from 'url';
import ApplicationStore from '../stores/ApplicationStore';

export default function navigateToQuickstart(context, payload, done) {

  const { quickstartId, platformId, articleId } = payload;
  const tokens = ['/docs'];

  if (quickstartId) {
    tokens.push('quickstart');
    tokens.push(quickstartId);
  } else {
    tokens.push('quickstarts');
  }

  if (platformId) tokens.push(platformId);
  if (articleId) tokens.push(articleId);

  const appStore = context.getStore(ApplicationStore);
  const isFramedMode = appStore.isFramedMode();

  const query = {};
  if (appStore.isFramedMode()) query.framed = 1;
  if (appStore.isSingleQuickstartMode()) query.sq = 1;

  const url = format({ pathname: tokens.join('/'), query });
  return navigateAction(context, { url }, done);
}
