import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class NavigationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.navigation = null;
    this.currentCategory = null;
  }

  getCategories() {
    if (this.navigation) {
      return this.navigation.categories;
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

  getCurrentCategory() {
    if (this.navigation && this.currentCategory) {
      return _.find(this.navigation.categories, c => c.id == this.currentCategory);
    }
    else {
      return undefined;
    }
  }

  handleNavigationLoaded(payload) {
    this.navigation = payload.navigation;
    this.emitChange();
  }

  handleCategorySelected(payload) {
    this.currentCategory = payload.category;
    this.emitChange();
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
  'NAVIGATION_LOADED': 'handleNavigationLoaded',
  'CATEGORY_SELECTED': 'handleCategorySelected'
};

export default NavigationStore;
