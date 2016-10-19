import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class ArticleStore extends BaseStore {
  
  constructor(dispatcher) {
    super(dispatcher);
    this.articles = {};
  }
  
  getArticleHtml(quickstartId, platformId, articleId) {
    let key = this.getKeyForArticle(quickstartId, platformId, articleId);
    return this.articles[key] || undefined;
  }
  
  handleArticleLoaded(payload) {
    let {quickstartId, platformId, articleId, html} = payload;
    let key = this.getKeyForArticle(quickstartId, platformId, articleId);
    this.articles[key] = html;
    this.emitChange();
  }
  
  handleArticleLoadFailure(payload) {
    // TODO: Handle the error
  }
  
  dehydrate() {
    return {
      articles: this.articles
    };
  }
  
  rehydrate(state) {
    this.articles = state.articles;
  }
  
  getKeyForArticle(quickstartId, platformId, articleId) {
    return [quickstartId, platformId, articleId].join('/');
  }
  
}

ArticleStore.storeName = 'ArticleStore';
ArticleStore.handlers = {
  'ARTICLE_LOAD_SUCCESS': 'handleArticleLoaded',
  'ARTICLE_LOAD_FAILURE': 'handleArticleLoadFailure'
};

export default ArticleStore;
