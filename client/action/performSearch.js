import SearchService from '../services/SearchService';

export default function performSearchAction(context, payload) {
  return SearchService.search(payload.query)
  .then(results => {
    context.dispatch('SEARCH_RESULTS_LOAD_SUCCESS', results);
  })
}
