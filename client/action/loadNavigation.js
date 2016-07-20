export default function loadNavigation(context, payload) {
  return context.dispatch('NAVIGATION_LOADED', {
    navigation: payload.navigation,
    currentSection: payload.currentSection
  });
}
