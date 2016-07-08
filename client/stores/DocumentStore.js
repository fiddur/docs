import { BaseStore } from 'fluxible/addons';
import _ from 'lodash';

class DocumentStore extends BaseStore {
  
  constructor(dispatcher) {
    super(dispatcher);
    this.currentDocumentId = undefined;
    this.documents = {};
  }

  getCurrentDocumentId() {
    return this.currentDocumentId;
  }
  
  getCurrentDocumentHtml() {
    if (this.currentDocumentId) {
      return this.documents[this.currentDocumentId];
    }
    else {
      return undefined;
    }
  }

  handleDocumentSelected(payload) {
    this.currentDocumentId = payload.id;
    this.emitChange();
  }
  
  handleDocumentLoaded(payload) {
    let {id, html} = payload;
    this.documents[id] = html;
    this.emitChange();
  }
  
  handleArticleLoadFailure(payload) {
    // TODO: Handle the error
  }
  
  dehydrate() {
    return {
      documents: this.documents,
      currentDocumentId: this.currentDocumentId
    };
  }
  
  rehydrate(state) {
    this.documents = state.documents;
    this.currentDocumentId = state.currentDocumentId;
  }
  
}

DocumentStore.storeName = 'DocumentStore';
DocumentStore.handlers = {
  'DOCUMENT_SELECTED':     'handleDocumentSelected',
  'DOCUMENT_LOAD_SUCCESS': 'handleDocumentLoaded',
  'DOCUMENT_LOAD_FAILURE': 'handleDocumentLoadFailure'
};

export default DocumentStore;
