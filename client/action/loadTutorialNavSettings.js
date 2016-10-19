export default function loadSettingsAction(context, payload) {
  return context.dispatch('LOAD_SETTINGS', {
    restricted: payload.restricted,
    singleArticleMode: payload.singleArticleMode
  });
}
