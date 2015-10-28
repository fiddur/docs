import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class NavigationStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
  }
  handleSettingsLoaded(payload) {
    this.navigation = payload.navigation;
    this.emitChange();
  }
  getCategories() {
    return this.navigation.categories;
  }
  dehydrate() {
    return {
      navigation: this.navigation,
    };
  }
  rehydrate(state) {
    this.navigation = state.navigation;
  }
}

NavigationStore.storeName = 'NavigationStore';
NavigationStore.handlers = {
  'LOAD_SETTINGS': 'handleSettingsLoaded'
};

export default NavigationStore;
