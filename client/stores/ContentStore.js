import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

export const ContentState = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
};

class ContentStore extends BaseStore {
  
  constructor(dispatcher) {
    super(dispatcher);
    this.currentContentUrl = undefined;
    this.content = {};
  }

  getContent(url) {
    return this.content[url] || undefined;
  }

  getCurrentContentUrl() {
    return this.currentContentUrl;
  }
  
  getCurrentContentHtml() {
    if (!this.currentContentUrl) {
      return undefined;
    }
    else {
      let content = this.content[this.currentContentUrl];
      if (content) {
        return content.html || undefined;
      }
      else {
        return undefined;
      }
    }
  }

  handleContentSelected(payload) {
    this.currentContentUrl = payload.url;
    this.emitChange();
  }

  handleContentLoading(payload) {
    let {url} = payload;
    this.content[url] = {state: ContentState.LOADING};
    this.emitChange();
  }
  
  handleContentLoaded(payload) {
    let {url, html} = payload;
    let content = this.content[url];
    content.state = ContentState.LOADED;
    content.html = html;
    this.emitChange();
  }
  
  handleContentLoadFailure(payload) {
    let {url, err} = payload;
    let content = this.content[url];
    content.state = ContentState.ERROR;
    content.error = err;
    this.emitChange();
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
  'CONTENT_LOADING':      'handleContentLoading',
  'CONTENT_LOAD_SUCCESS': 'handleContentLoaded',
  'CONTENT_LOAD_FAILURE': 'handleContentLoadFailure'
};

export default ContentStore;
