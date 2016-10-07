import { navigateAction } from 'fluxible-router';

export default function loadUserAction(context, payload) {
  context.dispatch('LOAD_USER', payload);
  return Promise.resolve();
}
