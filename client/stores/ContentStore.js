import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class ContentStore extends BaseStore {
  
  constructor(dispatcher) {
    super(dispatcher);
    this.currentContentUrl = undefined;
    this.content = {};
  }

  getCurrentContentUrl() {
    return this.currentContentUrl;
  }
  
  getCurrentContentHtml() {
    if (this.currentContentUrl) {
      return this.content[this.currentContentUrl];
    }
    else {
      return undefined;
    }
  }

  handleContentSelected(payload) {
    this.currentContentUrl = payload.url;
    this.emitChange();
  }
  
  handleContentLoaded(payload) {
    let {url, html} = payload;
    this.content[url] = html;
    this.emitChange();
  }
  
  handleContentLoadFailure(payload) {
    // TODO: Handle the error
  }
  
  dehydrate() {
    return {
      content: this.content,
      currentContentUrl: this.currentContentUrl
    };
  }
  
  rehydrate(state) {
    this.content = state.content;
    this.currentContentUrl = state.currentContentUrl;
  }
  
}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
  'CONTENT_SELECTED':     'handleContentSelected',
  'CONTENT_LOAD_SUCCESS': 'handleContentLoaded',
  'CONTENT_LOAD_FAILURE': 'handleContentLoadFailure'
};

export default ContentStore;
