import setConfiguration from '../../lib/middleware/configuration';
import async from 'async';
import path from 'path';
import jade from 'jade';
import { docsByUrl, docUrls } from '../../lib/docs/builder';
import processSections from '../../lib/docs/renderer';
import _ from 'lodash';

var viewname = path.resolve(__dirname, '../../views/doc-embedded.jade');

export default function(req, res) {
  return {
    loadArticle: function(quickstarts, payload) {
      
      let {quickstartId, platformId, articleId} = payload;
      
      return new Promise((resolve, reject) => {
        var pathname = `/${quickstarts[quickstartId].slug}/${platformId}/${articleId}`;
        
        var doc = docsByUrl[pathname];
        if (!doc) {
          var error = new Error('No document found at ' + req2.url);
          error.status = 404;
          return reject(error);
        }

        var locals = _.clone(res.locals);
        locals.configuration[payload.quickstartId] = payload.platformId;
        locals.configuration.internal = req.query.internal === 'true';
        locals.sections = processSections(doc, locals, true /* absolute links */);
        
        jade.renderFile(viewname, locals, function(err, html) {
          if (err) {
            return reject(err);
          } else {
            return resolve(html);
          }
        });
      });
      
    }
  };
}
