export default function loadStaticContent(context, payload, done) {
  context.dispatch('STATIC_CONTENT_LOADED', payload.content);
  done();
}
