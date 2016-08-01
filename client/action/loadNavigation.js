export default function loadNavigation(context, payload, done) {
  context.dispatch('NAVIGATION_LOADED', {
    navigation: payload.navigation,
    currentSection: payload.currentSection
  });
  if (done) done();
}
