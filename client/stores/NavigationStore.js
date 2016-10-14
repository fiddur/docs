import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import normalizeUrl from '../util/normalizeUrl';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
    this.platforms = null;
    this.cards = null;
  }

  getSections() {
    if (this.navigation) {
      return this.navigation.sections;
    }
    return [];
  }

  getMetadata(url) {
    if (this.navigation) {
      return this.navigation.metadata[normalizeUrl(url)];
    }
    return undefined;
  }

  getSidebarArticles(section) {
    if (this.navigation) {
      return this.navigation.sidebar[section];
    }
    return [];
  }

  getCards() {
    if (this.cards) {
      return this.cards;
    }
    return [];
  }

  getPlatforms() {
    if (this.platforms) {
      return this.platforms;
    }
    return [];
  }

  getQuickstarts() {
    if (this.quickstarts) {
      return this.quickstarts;
    }
    return [];
  }

  handleNavigationLoaded(payload) {
    this.navigation = {
      sections: payload.sections,
      sidebar: payload.sidebar
    };
    this.emitChange();
  }

  handleCardsLoaded(payload) {
    this.cards = payload.cards;
    this.emitChange();
  }

  handlePlatformsLoaded(payload) {
    this.platforms = payload.platforms;
    this.emitChange();
  }


  dehydrate() {
    return {
      navigation: this.navigation,
      platforms: this.platforms,
      cards: this.cards
    };
  }

  rehydrate(state) {
    this.navigation = state.navigation;
    this.platforms = state.platforms;
    this.cards = state.cards;
  }
}

NavigationStore.storeName = 'NavigationStore';
NavigationStore.handlers = {
  NAVIGATION_LOAD_SUCCESS: 'handleNavigationLoaded',
  CARDS_LOAD_SUCCESS: 'handleCardsLoaded',
  PLATFORMS_LOAD_SUCCESS: 'handlePlatformsLoaded'
};

export default NavigationStore;
