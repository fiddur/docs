import API from './API.client.js';

const NavigationService = {};

const cardsApiUrl = '/docs/meta/cards';
const platformsApiUrl = '/docs/meta/platforms';
const quickstartsApiUrl = '/docs/meta/quickstart';

NavigationService.loadCards = () => API.get(cardsApiUrl);

NavigationService.loadPlatforms = () => API.get(platformsApiUrl);

NavigationService.loadQuickstarts = () =>
  API.get(quickstartsApiUrl)
  .then(result => (
    { quickstarts: result }
  ));

export default NavigationService;
