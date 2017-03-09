export default function loadError(context, payload, done) {
  context.dispatch('DOCUMENT_LOAD_FAILURE', {
    url: payload.url,
    err: payload.err
  });
  if (done) done();
}
