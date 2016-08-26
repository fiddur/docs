import SearchService from '../services/SearchService';
import SearchStore, {SearchResultState} from '../stores/SearchStore';

export default function performSearchAction(context, payload, done) {

  let {query} = payload;

  if (!query || query.length == 0) {
    if (done) done();
    return;
  }

  let success = (response) => {
    context.dispatch('SEARCH_RESULT_LOAD_SUCCESS', {query, response});
    if (done) done();
  };

  let failure = (err) => {
    context.dispatch('SEARCH_RESULT_LOAD_FAILURE', {query, err});
    if (done) done(err);
  };

  // If we've already loaded (or started to load) the result, don't do it again.
  let result = context.getStore(SearchStore).getResult(query);
  if (result && (result.state == SearchResultState.LOADED || result.state == SearchResultState.LOADING)) {
    return done();
  }

  // If the result hasn't been loaded (or a previous load resulted in
  // an error), try to load it using the SearchService.
  context.dispatch('SEARCH_RESULT_LOADING', {query});
  return SearchService.search(query)
  .then(success)
  .catch(failure);

}
