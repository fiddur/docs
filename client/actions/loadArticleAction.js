import { getPlatformSlug } from '../util/tutorials';

export default function loadArticleAction(context, payload, done) {

  var params = {
    url: `/${getPlatformSlug(payload.appType)}/${payload.tech}`
  };

  console.log(params);

  context.service.read('article', params, {}, function (err, article) {
      if (err || !article) {
          context.dispatch('RECEIVE_ARTICLE_FAILURE', err);
      } else {
          context.dispatch('RECEIVE_ARTICLE_SUCCESS', {
            url: params.url,
            html: article.html
          });
      }
      done();
  });
}
