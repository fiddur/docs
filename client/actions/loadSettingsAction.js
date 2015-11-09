export default function loadSettingsAction(context, payload, done) {
  context.dispatch('LOAD_SETTINGS', {
    quickstart: payload.quickstart,
    navigation: payload.navigation
  });
  done();
}
