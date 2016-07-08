import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
    this.currentCategory = null;
  }

  handleNavigationLoaded(payload) {
    this.navigation = payload.navigation;
    this.currentCategory = payload.currentCategory;
    this.emitChange();
  }

  getCategories() {
    if (this.navigation) {
      return this.navigation.categories;
    }
    else {
      return [];
    }
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  dehydrate() {
    return {
      navigation: this.navigation,
      currentCategory: this.currentCategory
    };
  }

  rehydrate(state) {
    this.navigation = state.navigation;
    this.currentCategory = state.currentCategory;
  }
  
}

NavigationStore.storeName = 'NavigationStore';
NavigationStore.handlers = {
  'NAVIGATION_LOADED': 'handleNavigationLoaded'
};

export default NavigationStore;
