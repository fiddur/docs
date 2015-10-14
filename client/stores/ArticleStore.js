import { BaseStore } from 'fluxible/addons';

class ArticleStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.articles = [];
  }
  handleArticledLoaded(payload) {
    this.articles[payload.url] = payload.content;
    this.emitChange();
  }
  handleArticledLoadFailure(payload) {
    // TODO: Handle the error
  }
  getState() {
    return {
      articles: this.articles,
    };
  }
  dehydrate() {
    return this.getState();
  }
  rehydrate(state) {
    this.articles = state.articles;
  }
}

ArticleStore.storeName = 'ArticleStore';
ArticleStore.handlers = {
  'RECEIVE_ARTICLE_SUCCESS': 'handleArticledLoaded',
  'RECEIVE_ARTICLE_FAILURE': 'handleArticledLoadFailure'
};

export default ArticleStore;
