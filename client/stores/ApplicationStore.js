import _ from 'lodash';
import BaseStore from 'fluxible/addons/BaseStore';


class ApplicationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.flags = {};
    this.pageTitle = '';
    this.pageDescription = '';
  }

  isFullWidthMode() {
    return !!this.flags.fullWidth;
  }

  isFramedMode() {
    return !!this.flags.framed;
  }

  isSingleQuickstartMode() {
    return !!this.flags.singleQuickstart;
  }

  getPageTitle() {
    return this.pageTitle;
  }

  getPageDescription() {
    return this.pageDescription;
  }

  handleModeFlagsLoaded(payload) {
    this.flags = payload.flags;
    this.emitChange();
  }

  handlePageMetadata(payload) {
    this.pageTitle = payload.pageTitle;
    this.pageDescription = payload.pageDescription;
    this.emitChange();
  }

  dehydrate() {
    return {
      flags: this.flags,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription
    };
  }

  rehydrate(state) {
    this.flags = state.flags;
    this.pageTitle = state.pageTitle;
    this.pageDescription = state.pageDescription;
  }

}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  MODE_FLAGS_LOADED: 'handleModeFlagsLoaded',
  UPDATE_PAGE_METADATA: 'handlePageMetadata'
};

export default ApplicationStore;
