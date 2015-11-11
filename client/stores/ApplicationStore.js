import BaseStore from 'fluxible/addons/BaseStore';
import routesConfig from '../configs/routes';

class ApplicationStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.currentPageName = null;
    this.currentPage = null;
    this.pages = routesConfig;
    this.pageTitle = '';
    this.pageDescription = '';
  }
  handlePageMetadata(payload) {
    this.pageTitle = payload.pageTitle;
    this.pageDescription = payload.pageDescription;
    this.emitChange();
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
      currentPageName: this.currentPageName,
      currentPage: this.currentPage,
      pages: this.pages,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription,
    };
  }
  rehydrate(state) {
    this.currentPageName = state.currentPageName;
    this.currentPage = state.currentPage;
    this.pages = state.pages;
    this.pageTitle = state.pageTitle;
    this.pageDescription = state.pageDescription;
  }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  'UPDATE_PAGE_METADATA': 'handlePageMetadata',
};

export default ApplicationStore;
