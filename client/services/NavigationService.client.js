import Api from './Api';

const NavigationService = {};

const cardsApiUrl = '/docs/meta/cards';
const quickstartsApiUrl = '/docs/meta/quickstart';

NavigationService.loadCards = () => Api.get(cardsApiUrl);

NavigationService.loadQuickstarts = () =>
  Api.get(quickstartsApiUrl).then(result => (
    { quickstarts: result }
  ));

export default NavigationService;
