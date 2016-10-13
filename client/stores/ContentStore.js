import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import normalizeUrl from '../util/normalizeUrl';
import LoadState from './LoadState';

class ContentStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.contents = {};
  }

  getContent(url) {
    return this.contents[normalizeUrl(url)] || undefined;
  }

  getContentHtml(url) {
    const content = this.getContent(normalizeUrl(url));
    return content ? content.html : undefined;
  }

  handleContentLoading(payload) {
    const { url } = payload;
    this.contents[url] = { state: LoadState.LOADING };
    this.emitChange();
  }

  handleContentLoaded(payload) {
    const { url, content } = payload;
    this.contents[url] = { state: LoadState.LOADED, html: content.html, meta: content.meta };
    this.emitChange();
  }

  handleContentLoadFailure(payload) {
    const { url, err } = payload;
    this.contents[url] = { state: LoadState.ERROR, err };
    this.emitChange();
  }

  dehydrate() {
    return {
      contents: this.contents
    };
  }

  rehydrate(state) {
    this.contents = state.contents;
  }

}

ContentStore.storeName = 'ContentStore';
ContentStore.handlers = {
  CONTENT_LOADING: 'handleContentLoading',
  CONTENT_LOAD_SUCCESS: 'handleContentLoaded',
  CONTENT_LOAD_FAILURE: 'handleContentLoadFailure'
};

export default ContentStore;
