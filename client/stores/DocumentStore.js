import { BaseStore } from 'fluxible/addons';
import LoadState from './LoadState';
import normalizeUrl from '../util/normalizeUrl';
import replaceUserVars from '../../lib/replaceUserVars';

class DocumentStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.user = undefined;
    this.docs = {};
  }

  getDocument(url) {
    const doc = this.docs[normalizeUrl(url)];
    if (!doc) return undefined;
    if (doc.state === LoadState.LOADED && !doc.html) this.replaceVarsInDocument(doc);
    return doc;
  }

  replaceVarsInDocument(doc) {
    if (this.user) {
      doc.html = replaceUserVars(doc.originalHtml, this.user);
    } else {
      doc.html = doc.originalHtml;
    }
  }

  handleDocumentLoading({ url }) {
    this.docs[url] = { state: LoadState.LOADING };
    this.emitChange();
  }

  handleDocumentLoaded({ url, doc }) {
    this.docs[url] = { state: LoadState.LOADED, originalHtml: doc.html, meta: doc.meta };
    this.emitChange();
  }

  handleDocumentLoadFailure({ url, err }) {
    this.docs[url] = { state: LoadState.ERROR, err };
    this.emitChange();
  }

  handleUserLoaded({ user }) {
    this.user = user;
    Object.keys(this.docs).forEach(url => this.replaceVarsInDocument(this.docs[url]));
    this.emitChange();
  }

  dehydrate() {
    return {
      docs: this.docs,
      user: this.user
    };
  }

  rehydrate(state) {
    this.docs = state.docs;
    this.user = state.user;
  }

}

DocumentStore.storeName = 'DocumentStore';
DocumentStore.handlers = {
  DOCUMENT_LOADING: 'handleDocumentLoading',
  DOCUMENT_LOAD_SUCCESS: 'handleDocumentLoaded',
  DOCUMENT_LOAD_FAILURE: 'handleDocumentLoadFailure',
  USER_LOADED: 'handleUserLoaded'
};

export default DocumentStore;
