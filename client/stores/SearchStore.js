import { BaseStore } from 'fluxible/addons';

export const SearchResultState = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
};

class SearchStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.results = {};
  }

  handleResultLoading(payload) {
    this.results[payload.query] = {
      query: payload.query,
      state: SearchResultState.LOADING
    };
    this.emitChange();
  }

  handleResultLoaded(payload) {
    let result = this.results[payload.query];
    result.state = SearchResultState.LOADED;
    result.response = payload.response;
    this.emitChange();
  }

  handleResultLoadFailed(payload) {
    let result = this.results[payload.query];
    result.state = SearchResultState.ERROR;
    result.error = payload.err;
    this.emitChange();
  }

  getResult(query) {
    return this.results[query];
  }

  dehydrate() {
    return {
      results: this.results
    };
  }

  rehydrate(state) {
    this.results = state.results;
  }

}

SearchStore.storeName = 'SearchStore';
SearchStore.handlers = {
  'SEARCH_RESULT_LOADING': 'handleResultLoading',
  'SEARCH_RESULT_LOAD_SUCCESS': 'handleResultLoaded',
  'SEARCH_RESULT_LOAD_FAILURE': 'handleResultLoadFailed'
};

export default SearchStore;
