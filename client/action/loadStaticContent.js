export default function loadStaticContent(context, html, done) {
  context.dispatch('STATIC_CONTENT_LOADED', { html });
  done();
}
