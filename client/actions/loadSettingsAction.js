var loadSettingsAction = (context, payload, done) => {
  context.dispatch('LOAD_SETTINGS', {
    baseUrl: payload.baseUrl,
    quickstart: payload.quickstart,
  });
  done();
}

export default loadSettingsAction;
