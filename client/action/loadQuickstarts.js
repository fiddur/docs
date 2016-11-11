import { loadSettingsAction, TutorialStore } from 'auth0-tutorial-navigator';
import NavigationStore from '../stores/NavigationStore';
import LoadState from '../stores/LoadState';

export default function loadQuickstarts(context, payload) {
  const logger = context.getService('LoggingService');

  const success = ({ quickstarts }) => {
    context.dispatch('QUICKSTARTS_LOAD_SUCCESS', { quickstarts });
    logger.debug('Quickstarts loaded successfully.');
    return context.executeAction(loadSettingsAction, { quickstarts });
  };

  const failure = (err) => {
    context.dispatch('QUICKSTARTS_LOAD_FAILURE', { err });
    logger.warn('Error loading platforms.', { err });
  };

  // First, check to see if the content has already been loaded.
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();
  if (quickstarts) {
    // Quickstarts are already loaded so we just return.
    // The loadSettingsAction is only designed to be called once.
    return Promise.resolve();
  }

  // If the cards haven't been loaded (or a previous load resulted in
  // an error), try to load it using the NavigationService.
  context.dispatch('QUICKSTARTS_LOADING');
  return context.getService('NavigationService')
  .loadQuickstarts()
  .then(success)
  .catch(failure);
}
