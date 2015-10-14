import { BaseStore } from 'fluxible/addons';

class TutorialStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.appType = null;
    this.tech1 = null;
    this.tech2 = null;
    //this.skippable = null;
    //this.showTutorial = false;
    this.baseUrl = null;
    this.quickstart = null;
  }
  handleTutorialNavLoaded(payload) {
    this.appType = payload.appType;
    this.tech1 = payload.tech1;
    this.tech2 = payload.tech2;
    this.emitChange();
  }
  handleSettingsLoaded(payload) {
    this.baseUrl = payload.baseUrl;
    this.quickstart = payload.quickstart;
    this.emitChange();
  }
  getState() {
    return {
      appType: this.appType,
      tech1: this.tech1,
      tech2: this.tech2,
      baseUrl: this.baseUrl,
      quickstart: this.quickstart,
    };
  }
  dehydrate() {
    return this.getState();
  }
  rehydrate(state) {
    this.appType = state.appType;
    this.tech1 = state.tech1;
    this.tech2 = state.tech2;
    this.quickstart = state.quickstart;
    this.baseUrl = state.baseUrl;
  }
}

TutorialStore.storeName = 'TutorialStore';
TutorialStore.handlers = {
  'LOAD_TUTORIAL_NAVIGATOR': 'handleTutorialNavLoaded',
  'LOAD_SETTINGS': 'handleSettingsLoaded'
};

export default TutorialStore;
