import SearchService from '../services/SearchService';

export default function searchClickthroughAction(context, payload, done) {

  let {query, id} = payload;

  if (!query || query.length == 0 || !id || id.length == 0) {
    if (done) done();
    return;
  }

  return SearchService.recordClickthrough(query, id)
  .then(() => { if (done) done(); })
  .catch(() => { if (done) done(); })
}
