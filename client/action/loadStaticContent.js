export default function loadStaticContent(context, content, done) {
  context.dispatch('STATIC_CONTENT_LOADED', content);
  done();
}
