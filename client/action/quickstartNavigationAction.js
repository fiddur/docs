import { navigateAction } from 'fluxible-router';

export function quickstartNavigationAction(context, payload, done) {

  let {quickstartId, platformId, articleId} = payload;
  let tokens = ['/docs'];

  if (quickstartId) {
    tokens.push('quickstart');
    tokens.push(quickstartId);
  }

  if (platformId) tokens.push(platformId);
  if (articleId)  tokens.push(articleId);

  let url = tokens.join('/');
  return navigateAction(context, {url}, done);

}
