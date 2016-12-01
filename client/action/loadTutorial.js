import ApplicationStore from '../stores/ApplicationStore';
import TutorialStore from '../stores/TutorialStore';

export default function loadArticleAction(context, payload, done) {
  const articleService = context.getService('ArticleService');

  const isFramedMode = context.getStore(ApplicationStore).isFramedMode();
  const quickstarts = context.getStore(TutorialStore).getQuickstarts();

  let { quickstartId, platformId, articleId, clientId } = payload;

  if (quickstartId && platformId && !articleId) {
    const platform = quickstarts[quickstartId].platforms[platformId];
    if (isFramedMode && platform.defaultArticle) {
      articleId = platform.defaultArticle.name;
    } else {
      articleId = platform.articles[0].name;
    }
  }

  return articleService.loadArticle(quickstarts, { quickstartId, platformId, articleId, clientId })
  .then(html => {
    context.dispatch('ARTICLE_LOAD_SUCCESS', { html, quickstartId, platformId, articleId });
    if (done) done();
  }).catch(err => {
    context.dispatch('ARTICLE_LOAD_FAILURE', err);
    if (done) done();
    return err;
  });

}
