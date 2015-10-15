


export default function loadArticleAction(context, payload, done) {
  context.getService('articleService').loadArticle(payload)
  .then((html) => {
    context.dispatch('RECEIVE_ARTICLE_SUCCESS', {
      appType: payload.appType,
      tech: payload.currentTech,
      html: html
    });
    done();
  }).catch((err) => {
    context.dispatch('RECEIVE_ARTICLE_FAILURE', err);
    done();
  });
}
