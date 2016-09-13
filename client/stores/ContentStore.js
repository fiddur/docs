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
    this.content = {};
  }

  getContent(url) {
    return this.content[url] || undefined;
  }

  getContentHtml(url) {
    let content = this.getContent(url);
    return content ? content.html : undefined;
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
      content: this.content
    };
  }
  
  rehydrate(state) {
    this.content = state.content;
  }
  
}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
  'CONTENT_LOADING':      'handleContentLoading',
  'CONTENT_LOAD_SUCCESS': 'handleContentLoaded',
  'CONTENT_LOAD_FAILURE': 'handleContentLoadFailure'
};

export default ContentStore;
