import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';
import sendMessageToParentFrame from '../util/sendMessageToParentFrame';

class QuickstartStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.quickstarts = undefined;
    this.currentQuickstartId = undefined;
    this.currentPlatformId = undefined;
    this.currentVersionId = undefined;
    this.currentArticleId = undefined;
    this.isFramedMode = false;
  }

  getQuickstarts() {
    return this.quickstarts;
  }

  getCurrentQuickstart() {
    if (!this.currentQuickstartId) return undefined;
    return this.quickstarts[this.currentQuickstartId];
  }

  getCurrentPlatform() {
    const quickstart = this.getCurrentQuickstart();
    if (!quickstart || !this.currentPlatformId) return undefined;
    return quickstart.platforms[this.currentPlatformId];
  }

  getCurrentVersion() {
    const platform = this.getCurrentPlatform();
    if (!platform || !this.currentVersionId) return undefined;
    return platform.previousVersions[this.currentVersionId];
  }

  getCurrentArticle() {
    const platform = this.getCurrentPlatform();
    if (!platform) return undefined;

    if (this.isFramedMode && platform.defaultArticle) {
      return platform.defaultArticle;
    }

    let articles = platform.articles;
    if (this.currentVersionId) {
      articles = platform.previousVersions[this.currentVersionId].articles;
    }

    if (this.currentArticleId) {
      return _.find(articles, { name: this.currentArticleId });
    }

    return _.first(articles);
  }

  handleQuickstartSelected(payload) {
    this.currentQuickstartId = payload.quickstartId;
    this.currentPlatformId = payload.platformId;
    this.currentVersionId = payload.versionId;
    this.currentArticleId = payload.articleId;
    if (this.isFramedMode) {
      sendMessageToParentFrame({ type: 'tutorialSelected', tutorial: payload });
    }
    this.emitChange();
  }

  handleQuickstartsLoaded(payload) {
    this.quickstarts = payload.quickstarts;
    this.emitChange();
  }

  handleModeFlagsLoaded(payload) {
    this.isFramedMode = payload.flags.framed;
    this.emitChange();
  }

  dehydrate() {
    return {
      quickstarts: this.quickstarts,
      currentQuickstartId: this.currentQuickstartId,
      currentPlatformId: this.currentPlatformId,
      currentVersionId: this.currentVersionId,
      currentArticleId: this.currentArticleId,
      isFramedMode: this.isFramedMode
    };
  }

  rehydrate(state) {
    this.quickstarts = state.quickstarts;
    this.currentQuickstartId = state.currentQuickstartId;
    this.currentPlatformId = state.currentPlatformId;
    this.currentVersionId = state.currentVersionId;
    this.currentArticleId = state.currentArticleId;
    this.isFramedMode = state.isFramedMode;
  }

}

QuickstartStore.storeName = 'QuickstartStore';
QuickstartStore.handlers = {
  QUICKSTART_SELECTED: 'handleQuickstartSelected',
  QUICKSTARTS_LOAD_SUCCESS: 'handleQuickstartsLoaded',
  MODE_FLAGS_LOADED: 'handleModeFlagsLoaded'
};

export default QuickstartStore;