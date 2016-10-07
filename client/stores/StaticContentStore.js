import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import normalizeUrl from '../util/normalizeUrl';

class StaticContentStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.html = {};
  }

  getContentHtml() {
    return this.html;
  }

  handleContentLoaded(payload) {
    this.html = payload.html;
    this.emitChange();
  }

  dehydrate() {
    return {
      html: this.html
    };
  }

  rehydrate(state) {
    this.html = state.html;
  }

}

StaticContentStore.storeName = 'StaticContentStore';
StaticContentStore.handlers = {
  STATIC_CONTENT_LOADED: 'handleContentLoaded'
};

export default StaticContentStore;
