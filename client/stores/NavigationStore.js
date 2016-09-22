import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import normalizeUrl from '../util/normalizeUrl';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
  }

  getSections() {
    if (this.navigation) {
      return this.navigation.sections;
    }
    else {
      return [];
    }
  }

  getMetadata(url) {
    if (this.navigation) {
      return this.navigation.metadata[normalizeUrl(url)];
    }
    else {
      return undefined;
    }
  }

  getSidebarArticles(section) {
    if (this.navigation) {
      return this.navigation.sidebar[section];
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
  'NAVIGATION_LOADED': 'handleNavigationLoaded',
};

export default NavigationStore;
