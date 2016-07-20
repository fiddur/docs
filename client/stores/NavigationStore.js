import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
    this.currentSection = null;
  }

  getCategories() {
    if (this.navigation) {
      return this.navigation.categories;
    }
    else {
      return [];
    }
  }

  getCurrentSection() {
    return this.currentSection;
  }

  handleNavigationLoaded(payload) {
    this.navigation = payload.navigation;
    this.currentSection = payload.currentSection;
    this.emitChange();
  }

  handleSectionSelected(payload) {
    this.currentSection = payload.section;
    this.emitChange();
  }

  dehydrate() {
    return {
      navigation: this.navigation,
      currentSection: this.currentSection
    };
  }

  rehydrate(state) {
    this.navigation = state.navigation;
    this.currentSection = state.currentSection;
  }
  
}

NavigationStore.storeName = 'NavigationStore';
NavigationStore.handlers = {
  'NAVIGATION_LOADED': 'handleNavigationLoaded',
  'SECTION_SELECTED': 'handleSectionSelected'
};

export default NavigationStore;
