import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
    this.currentSection = null;
  }

  getSections() {
    if (this.navigation) {
      return this.navigation.sections;
    }
    else {
      return [];
    }
  }

  getCurrentSection() {
    return this.currentSection;
  }

  getMetadata(url) {
    if (this.navigation) {
      return this.navigation.metadata[url];
    }
    else {
      return undefined;
    }
  }

  getCurrentSidebarArticles() {
    if (this.navigation && this.currentSection) {
      return this.navigation.sidebar[this.currentSection];
    }
    else {
      return [];
    }
  }

  getCards() {
    if (this.navigation) {
      return this.navigation.cards;
    }
    else {
      return [];
    }
  }

  getPlatforms() {
    if (this.navigation) {
      return this.navigation.platforms;
    }
    else {
      return [];
    }
  }

  handleNavigationLoaded(payload) {
    this.navigation = payload.navigation;
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
