


export default function loadArticleAction(context, payload, done) {
  context.getService('articleService').loadArticle(payload)
  .then((html) => {
    context.dispatch('RECIEVE_ARTICLE_SUCCESS', {
      appType: payload.appType,
      tech: payload.currentTech,
      html: html
    });
    done();
  }).catch((err) => {
    context.dispatch('RECIEVE_ARTICLE_FAILURE', err);
    return done(err);
  });
}
