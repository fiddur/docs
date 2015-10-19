import BaseStore from 'fluxible/addons/BaseStore';
import routesConfig from '../configs/routes';
import RouteStore from './RouteStore';

class ApplicationStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.currentPageName = null;
    this.currentPage = null;
    this.pages = routesConfig;
    this.pageTitle = '';
    this.baseUrl = null;
  }
  handlePageTitle(currentRoute) {
    this.dispatcher.waitFor(RouteStore, () => {
      if (currentRoute && currentRoute.get('title')) {
        this.pageTitle = currentRoute.get('title');
        this.emitChange();
      }
    });
  }
  handleSettingsLoaded(payload) {
    this.baseUrl = payload.baseUrl;
  }
  getCurrentPageName() {
    return this.currentPageName;
  }
  getPageTitle() {
    return this.pageTitle;
  }
  getPages() {
    return this.pages;
  }
  getBaseUrl() {
    return this.baseUrl;
  }
  dehydrate() {
    return {
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      pageTitle: this.pageTitle,
      baseUrl: this.baseUrl,
    };
  }
  rehydrate(state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.pageTitle = state.pageTitle;
    this.baseUrl = state.baseUrl;
  }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  'NAVIGATE_SUCCESS': 'handlePageTitle',
  'LOAD_SETTINGS': 'handleSettingsLoaded'
};

export default ApplicationStore;
