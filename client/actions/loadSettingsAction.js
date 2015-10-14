export default function loadSettingsAction(context, payload, done) {
  context.dispatch('LOAD_SETTINGS', {
    baseUrl: payload.baseUrl,
    quickstart: payload.quickstart,
    navigation: payload.navigation
  });
  done();
}
