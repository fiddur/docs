import BaseStore from 'fluxible/addons/BaseStore';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.env = null;
    this.currentPageName = null;
    this.currentPage = null;
    this.pages = routesConfig;
    this.pageTitle = '';
    this.pageDescription = '';
  }

  handleEnvironmentLoaded(payload) {
    this.env = payload.env;
    this.emitChange();
  }

  handlePageMetadata(payload) {
    this.pageTitle = payload.pageTitle;
    this.pageDescription = payload.pageDescription;
    this.emitChange();
  }

  getEnvironmentVars() {
    return this.env;
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

  dehydrate() {
    return {
      env: this.env,
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription,
    };
  }

  rehydrate(state) {
    this.env = state.env;
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.pageTitle = state.pageTitle;
    this.pageDescription = state.pageDescription;
  }
  
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  'ENVIRONMENT_LOADED': 'handleEnvironmentLoaded',
  'UPDATE_PAGE_METADATA': 'handlePageMetadata',
};

export default ApplicationStore;
