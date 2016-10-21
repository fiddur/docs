import { navigateAction } from 'fluxible-router';

export default function navigateTutorial(context, payload, done) {

  let {quickstartId, platformId, articleId} = payload;
  let tokens = ['/docs'];

  if (quickstartId) {
    tokens.push('quickstart');
    tokens.push(quickstartId);
  } else {
    tokens.push('quickstarts');
  }

  if (platformId) tokens.push(platformId);
  if (articleId) tokens.push(articleId);

  let url = tokens.join('/');
  if (payload.isFramedMode) {
    url += '?framed=1';
  }
  return navigateAction(context, { url }, done);

}
