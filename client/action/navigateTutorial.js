export default function navigateAction(context, payload) {
  return context.dispatch('LOAD_TUTORIAL_NAVIGATOR', {
    quickstartId: payload.quickstartId,
    platformId: payload.platformId,
    articleId: payload.articleId
  });
}
