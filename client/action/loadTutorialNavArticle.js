import TutorialStore from '../stores/TutorialStore';

export default function loadArticleAction(context, payload, done) {

  let articleService = context.getService('ArticleService');

  let store = context.getStore(TutorialStore);
  let quickstarts = store.getQuickstarts();
  let isSingleArticleMode = store.getSingleArticleMode();

  let {quickstartId, platformId, articleId, clientId} = payload;

  if (quickstartId && platformId && !articleId) {
    let platform = quickstarts[quickstartId].platforms[platformId];
    if (isSingleArticleMode && platform.defaultArticle) {
      articleId = platform.defaultArticle.name;
    }
    else {
      articleId = platform.articles[0].name;
    }
  }

  return articleService.loadArticle(quickstarts, {quickstartId, platformId, articleId, clientId})
  .then(html => {
    context.dispatch('ARTICLE_LOAD_SUCCESS', {html, quickstartId, platformId, articleId});
    if (done) done();
  }).catch(err => {
    context.dispatch('ARTICLE_LOAD_FAILURE', err);
    if (done) done();
    return err;
  });

}
