import { loadSettingsAction } from 'auth0-tutorial-navigator';
import NavigationStore from '../stores/NavigationStore';
import LoadState from '../stores/LoadState';


export default function loadPlatforms(context, payload) {
  const logger = context.getService('LoggingService');

  const success = ({ quickstarts }) => {
    context.dispatch('QUICKSTARTS_LOAD_SUCCESS', { quickstarts });
    logger.debug('Platforms loaded successfully.');
    return context.executeAction(loadSettingsAction, { quickstarts });
  };

  const failure = (err) => {
    context.dispatch('QUICKSTARTS_LOAD_FAILURE', { err });
    logger.warn('Error loading platforms.', { err });
  };

  // First, check to see if the content has already been loaded.
  const content = context.getStore(NavigationStore).getPlatforms();
  if (content) {
    if (content.state === LoadState.LOADED) {
      // If it has been loaded, just return the already-loaded content.
      return success(content);
    }
  }

  // If the cards haven't been loaded (or a previous load resulted in
  // an error), try to load it using the NavigationService.
  context.dispatch('QUICKSTARTS_LOADING');
  return context.getService('NavigationService')
  .loadQuickstarts()
  .then(success)
  .catch(failure);
}
