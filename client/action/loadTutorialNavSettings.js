export default function loadSettingsAction(context, payload) {
  return context.dispatch('LOAD_SETTINGS', {
    quickstarts: payload.quickstarts,
    navigation: payload.navigation,
    selectedTutorial: payload.selectedTutorial,
    restricted: payload.restricted,
    singleArticleMode: payload.singleArticleMode,
    baseUrl: payload.baseUrl
  });
};
