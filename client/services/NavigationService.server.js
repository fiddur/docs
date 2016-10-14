import { cards } from '../../lib/data/navigation';
import platforms from '../../lib/collections/platforms';
import quickstarts from '../../lib/collections/quickstarts';

const NavigationService = {};

NavigationService.loadCards = () => Promise.resolve({ cards });

NavigationService.loadPlatforms = () => Promise.resolve({ platforms });

NavigationService.loadQuickstarts = () => Promise.resolve({ quickstarts });

export default NavigationService;
