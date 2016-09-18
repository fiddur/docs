import {parse} from 'url';
import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

export const ContentState = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
};

let normalizeUrl = (url) => parse(url).pathname;

class ContentStore extends BaseStore {
  
  constructor(dispatcher) {
    super(dispatcher);
    this.content = {};
  }

  getContent(url) {
    return this.content[normalizeUrl(url)] || undefined;
  }

  getContentHtml(url) {
    let content = this.getContent(normalizeUrl(url));
    return content ? content.html : undefined;
  }

  handleContentLoading(payload) {
    let {url} = payload;
    this.content[url] = {state: ContentState.LOADING};
    this.emitChange();
  }
  
  handleContentLoaded(payload) {
    let {url, html} = payload;
    this.content[url] = {state: ContentState.LOADED, html};
    this.emitChange();
  }
  
  handleContentLoadFailure(payload) {
    let {url, err} = payload;
    this.content[url] = {state: ContentState.ERROR, err};
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
