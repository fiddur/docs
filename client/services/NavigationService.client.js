import API from './API.client.js';

const NavigationService = {};

const cardsApiUrl = '/docs/meta/cards';
const quickstartsApiUrl = '/docs/meta/quickstart';

NavigationService.loadCards = () => API.get(cardsApiUrl);

NavigationService.loadQuickstarts = () =>
  API.get(quickstartsApiUrl)
  .then(result => (
    { quickstarts: result }
  ));

export default NavigationService;
