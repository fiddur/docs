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

        var options = _.clone(res.locals);
        options.configuration[payload.appType] = payload.tech1
        if(payload.tech2) {
          options.configuration.api = payload.tech2;
        }
        // options.configuration.frontend = req.query.frontend || null;
        // options.configuration.api = req.query.api || null;
        // options.configuration.backend = req.query.backend || null;
        // options.configuration.mobile = req.query.mobile || null;
        // // combination data
        // options.configuration.thirdParty = req.query['3rd'] || req.query.thirdparty || req.query.thirdpParty || false;
        // options.configuration.hybrid = req.query.hybrid || false;




        options.sections = processSections(doc, options, true /* absolute links */);
        jade.renderFile(viewname, options, function(err, html) {
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
