import { getPlatformSlug } from '../util/tutorials';
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
    loadArticle: function(payload) {
      return new Promise((resolve, reject) => {
        var pathname = `/${getPlatformSlug(payload.appType)}/${payload.currentTech}`;
        var doc = docsByUrl[pathname];
        if (!doc) {
          var error = new Error('No document found at ' + req2.url);
          error.status = 404;
          return reject(error);
        }

        var locals = _.clone(res.locals);
        locals.configuration[payload.appType] = payload.tech1
        if(payload.tech2) {
          locals.configuration.api = payload.tech2;
        }

        locals.configuration.internal = req.query.internal === 'true';

        // locals.configuration.frontend = req.query.frontend || null;
        // locals.configuration.api = req.query.api || null;
        // locals.configuration.backend = req.query.backend || null;
        // locals.configuration.mobile = req.query.mobile || null;
        // // combination data
        // locals.configuration.thirdParty = req.query['3rd'] || req.query.thirdparty || req.query.thirdpParty || false;
        // locals.configuration.hybrid = req.query.hybrid || false;

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
