import { BaseStore } from 'fluxible/addons';

class SearchStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.results = [];
  }
  handleResultsLoaded(payload) {
    this.results = payload;
    this.emitChange();
  }
  handleResultsFailed(payload) {

  }
  getResults() {
    return this.results;
  }
  dehydrate() {
    return {
      user: this.results,
    };
  }
  rehydrate(state) {
    this.results = state.results;
  }
}

SearchStore.storeName = 'SearchStore';
SearchStore.handlers = {
  'SEARCH_RESULTS_LOAD_SUCCESS': 'handleResultsLoaded',
  'SEARCH_RESULTS_LOAD_FAILURE': 'handleResultsFailed'
};

export default SearchStore;
