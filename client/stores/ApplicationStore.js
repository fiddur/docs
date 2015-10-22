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
    this.pageDescription = '';
    this.baseUrl = null;
  }
  handlePageMetadata(payload) {
    this.pageTitle = payload.pageTitle;
    this.pageDescription = payload.pageDescription;
    this.emitChange();
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
  getPageDescription() {
    return this.pageDescription;
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
      pageDescription: this.pageDescription,
      baseUrl: this.baseUrl,
    };
  }
  rehydrate(state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.pageTitle = state.pageTitle;
    this.pageDescription = state.pageDescription;
    this.baseUrl = state.baseUrl;
  }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  'UPDATE_PAGE_METADATA': 'handlePageMetadata',
  'LOAD_SETTINGS': 'handleSettingsLoaded'
};

export default ApplicationStore;
