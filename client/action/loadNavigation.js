export default function loadNavigation(context, payload, done) {
  context.dispatch('NAVIGATION_LOAD_SUCCESS', {
    sections: payload.sections,
    sidebar: payload.sidebar
  });
  if (done) done();
}
