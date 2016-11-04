import _ from 'lodash';
import docs from '../../lib/pipeline';
import replaceUserVars from '../../lib/replaceUserVars';

export default function createArticleService(req, res) {
  return {
    loadArticle: (quickstarts, payload) => {
      const { quickstartId, platformId, articleId } = payload;
      return new Promise((resolve, reject) => {
        const url = [quickstarts[quickstartId].slug, platformId, articleId].join('/');
        const doc = docs.getByUrl(url);
        if (!doc) {
          const error = new Error(`No document found at ${req.url}`);
          error.status = 404;
          return reject(error);
        }
        const html = replaceUserVars(doc.getContent(), res.locals);
        resolve(html);
      });
    }
  };
}
