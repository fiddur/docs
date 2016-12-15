import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import normalizeUrl from '../util/normalizeUrl';

class StaticContentStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.content = undefined;
  }

  getContent() {
    return this.content;
  }

  handleContentLoaded(payload) {
    this.content = payload;
    this.emitChange();
  }

  dehydrate() {
    return {
      content: this.content
    };
  }

  rehydrate(state) {
    this.content = state.content;
  }

}

StaticContentStore.storeName = 'StaticContentStore';
StaticContentStore.handlers = {
  STATIC_CONTENT_LOADED: 'handleContentLoaded'
};

export default StaticContentStore;
