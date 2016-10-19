import {BaseStore} from 'fluxible/addons';
import _ from 'lodash';

class TutorialStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.quickstarts = undefined;
    this.currentQuickstartId = undefined;
    this.currentPlatformId = undefined;
    this.currentArticleId = undefined;
    this.restricted = false;
    this.singleArticleMode = false;
  }

  getQuickstarts() {
    return this.quickstarts;
  }

  getRestricted() {
    return this.restricted;
  }

  getSingleArticleMode() {
    return this.singleArticleMode;
  }

  getCurrentQuickstart() {
    if (this.currentQuickstartId) {
      return this.quickstarts[this.currentQuickstartId];
    }
    else {
      return undefined;
    }
  }

  getCurrentPlatform() {
    let quickstart = this.getCurrentQuickstart();
    if (quickstart && this.currentPlatformId) {
      return quickstart.platforms[this.currentPlatformId];
    }
    else {
      return undefined;
    }
  }

  getCurrentArticle() {
    let platform = this.getCurrentPlatform();
    if (platform) {
      if (this.singleArticleMode && platform.defaultArticle) {
        return platform.defaultArticle;
      }
      else if (this.currentArticleId) {
        return _.find(platform.articles, {name: this.currentArticleId});
      }
      else {
        return _.first(platform.articles);
      }
    }
  }

  handleTutorialNavigatorLoaded(payload) {
    this.currentQuickstartId = payload.quickstartId;
    this.currentPlatformId = payload.platformId;
    this.currentArticleId = payload.articleId;
    this.emitChange();
  }

  handleArticleSelected(payload) {
    this.currentPlatformId = payload.platformId;
    this.currentArticleId = payload.articleId;
    this.emitChange();
  }

  handleQuickstartsLoaded(payload) {
    this.quickstarts = payload.quickstarts;
    this.emitChange();
  }

  handleSettingsLoaded(payload) {
    this.restricted = payload.restricted;
    this.singleArticleMode = payload.singleArticleMode;
    this.emitChange();
  }

  dehydrate() {
    return {
      quickstarts: this.quickstarts,
      currentQuickstartId: this.currentQuickstartId,
      currentPlatformId: this.currentPlatformId,
      currentArticleId: this.currentArticleId,
      restricted: this.restricted,
      singleArticleMode: this.singleArticleMode
    }
  }

  rehydrate(state) {
    this.quickstarts = state.quickstarts;
    this.currentQuickstartId = state.currentQuickstartId;
    this.currentPlatformId = state.currentPlatformId;
    this.currentArticleId = state.currentArticleId;
    this.restricted = state.restricted;
    this.singleArticleMode = state.singleArticleMode;
  }

}

TutorialStore.storeName = 'TutorialStore';
TutorialStore.handlers = {
  ARTICLE_LOADED: 'handleArticleSelected',
  LOAD_TUTORIAL_NAVIGATOR: 'handleTutorialNavigatorLoaded',
  QUICKSTARTS_LOAD_SUCCESS: 'handleQuickstartsLoaded',
  LOAD_SETTINGS: 'handleSettingsLoaded'
};

export default TutorialStore;
