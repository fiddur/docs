import { BaseStore } from 'fluxible/addons';

class TutorialArticleStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.articles = [];
  }
  handleArticledLoaded(payload) {
    this.articles[payload.appType + '/' + payload.tech] = payload.html;
    this.emitChange();
  }
  handleArticledLoadFailure(payload) {
    // TODO: Handle the error
  }
  getArticle(appType, tech) {
    return this.articles[appType + '/' + tech];
  }
  getState() {
    return {
      articles: this.article
    }
  }
  dehydrate() {
    return this.getState();
  }
  rehydrate(state) {
    this.articles = state.articles;
  }
}

TutorialArticleStore.storeName = 'TutorialArticleStore';
TutorialArticleStore.handlers = {
  'RECEIVE_ARTICLE_SUCCESS': 'handleArticledLoaded',
  'RECEIVE_ARTICLE_FAILURE': 'handleArticledLoadFailure'
};

export default TutorialArticleStore;
