import NavigationStore from '../stores/NavigationStore';

export default function loadCards(context, payload) {
  const logger = context.getService('LoggingService');

  const success = ({ cards }) => {
    context.dispatch('CARDS_LOAD_SUCCESS', { cards });
    logger.debug('Cards loaded successfully.');
  };

  const failure = (err) => {
    context.dispatch('CARDS_LOAD_FAILURE', { err });
    logger.warn('Error loading cards.', { err });
  };

  // First, check to see if the content has already been loaded.
  const cards = context.getStore(NavigationStore).getCards();
  if (cards) {
    return success({ cards });
  }

  // If the cards haven't been loaded (or a previous load resulted in
  // an error), try to load it using the NavigationService.
  context.dispatch('CARDS_LOADING');
  return context.getService('NavigationService')
  .loadCards()
  .then(success)
  .catch(failure);
}
