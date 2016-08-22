import { docsByUrl, docUrls } from '../../lib/docs/builder';
import { renderContent } from '../../lib/docs/renderer';
import _ from 'lodash';

export default function(req, res) {
  return {
    
    loadArticle: function(quickstarts, payload) {
      
      let {quickstartId, platformId, articleId} = payload;
      
      return new Promise((resolve, reject) => {
        let pathname = `/${quickstarts[quickstartId].slug}/${platformId}/${articleId}`;
        
        let doc = docsByUrl[pathname];
        if (!doc) {
          let error = new Error('No document found at ' + req.url);
          error.status = 404;
          return reject(error);
        }

        try {
          let locals = _.clone(res.locals);
          locals.configuration[payload.quickstartId] = payload.platformId;
          locals.configuration.internal = req.query.internal === 'true';

          let html = renderContent(doc, locals, true /* absolute links */);
          return resolve(html);
        }
        catch (err) {
          err.status = 500;
          return reject(err);
        }

      });
      
    }
  };
}
