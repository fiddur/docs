import NavigationStore from '../stores/NavigationStore';

export default function loadPlatforms(context, payload) {
  const logger = context.getService('LoggingService');

  const success = ({ platforms }) => {
    context.dispatch('PLATFORMS_LOAD_SUCCESS', { platforms });
    logger.debug('Platforms loaded successfully.');
  };

  const failure = (err) => {
    context.dispatch('PLATFORMS_LOAD_FAILURE', { err });
    logger.warn('Error loading platforms.', { err });
  };

  // First, check to see if the content has already been loaded.
  const platforms = context.getStore(NavigationStore).getPlatforms();
  if (platforms) {
    return Promise.resolve();
  }

  // If the cards haven't been loaded (or a previous load resulted in
  // an error), try to load it using the NavigationService.
  context.dispatch('PLATFORMS_LOADING');
  return context.getService('NavigationService')
  .loadPlatforms()
  .then(success)
  .catch(failure);
}
