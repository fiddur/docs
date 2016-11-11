import { cards } from '../../lib/data/navigation';
import docs from '../../lib/pipeline';

const NavigationService = {};

NavigationService.loadCards = () => Promise.resolve({ cards });

NavigationService.loadPlatforms = () => Promise.resolve({
  platforms: docs.getReduction('platforms')
});

NavigationService.loadQuickstarts = () => Promise.resolve({
  quickstarts: docs.getReduction('quickstarts')
});

export default NavigationService;
