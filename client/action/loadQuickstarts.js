import TutorialStore from '../stores/TutorialStore';
import NavigationStore from '../stores/NavigationStore';
import LoadState from '../stores/LoadState';

export default function loadQuickstarts(context, payload) {
  const logger = context.getService('LoggingService');

  const success = ({ quickstarts }) => {
    context.dispatch('QUICKSTARTS_LOAD_SUCCESS', { quickstarts });
    logger.debug('Platforms loaded successfully.');
  };

  const failure = (err) => {
    context.dispatch('QUICKSTARTS_LOAD_FAILURE', { err });
    logger.warn('Error loading quickstarts.', { err });
  };

  // First, check to see if the content has already been loaded.
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();
  if (quickstarts) {
    return success({ quickstarts });
  }

  // If the cards haven't been loaded (or a previous load resulted in
  // an error), try to load it using the NavigationService.
  context.dispatch('QUICKSTARTS_LOADING');
  return context.getService('NavigationService')
  .loadQuickstarts()
  .then(success)
  .catch(failure);
}
