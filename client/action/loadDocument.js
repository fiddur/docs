export default function loadDocument(context, route, done) {

  let id = route.url;
  context.dispatch('DOCUMENT_SELECTED', {id});

  return context.getService('DocumentService')
  .loadDocument(id)
  .then(html => {
    context.dispatch('DOCUMENT_LOAD_SUCCESS', {id, html});
    if (done) done();
  })
  .catch(err => {
    context.dispatch('DOCUMENT_LOAD_FAILURE', {id, err});
    if (done) done(err);
  });

}
