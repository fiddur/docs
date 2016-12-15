import _ from 'lodash';
import BaseStore from 'fluxible/addons/BaseStore';


class ApplicationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.env = null;
    this.user = null;
    this.pageTitle = '';
    this.pageDescription = '';
  }

  handleEnvironmentUpdated(payload) {
    this.env = _.merge(this.env, payload.env);
    this.emitChange();
  }

  handleEnvironmentLoaded(payload) {
    this.env = payload.env;
    this.user = payload.user;
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

  getUser() {
    return this.user;
  }

  getPageTitle() {
    return this.pageTitle;
  }

  getPageDescription() {
    return this.pageDescription;
  }

  dehydrate() {
    return {
      env: this.env,
      user: this.user,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription
    };
  }

  rehydrate(state) {
    this.env = state.env;
    this.user = state.user;
    this.pageTitle = state.pageTitle;
    this.pageDescription = state.pageDescription;
  }

}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  'ENVIRONMENT_UPDATED': 'handleEnvironmentUpdated',
  'ENVIRONMENT_LOADED': 'handleEnvironmentLoaded',
  'UPDATE_PAGE_METADATA': 'handlePageMetadata',
};

export default ApplicationStore;
