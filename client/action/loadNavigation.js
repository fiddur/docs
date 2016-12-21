export default function loadNavigation(context, payload, done) {
  context.dispatch('NAVIGATION_LOAD_SUCCESS', {
    sections: payload.sections,
    sidebar: payload.sidebar,
    headerRibbon: payload.headerRibbon
  });
  if (done) done();
}
