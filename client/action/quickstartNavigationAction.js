import { navigateAction } from 'fluxible-router';

export function quickstartNavigationAction(context, payload, done) {
  let tokens = ['/docs'];
  
  if (payload.appType) {
    tokens.push('quickstart');
    tokens.push(payload.appType);
  }
  
  if (payload.platform) tokens.push(payload.platform);
  if (payload.article)  tokens.push(payload.article);
  
  let url = tokens.join('/');
  return navigateAction(context, {url}, done);
}
