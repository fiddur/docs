import { getPlatformSlug } from '../util/tutorials';
import { middlewares } from '../../lib/docs';
import setConfiguration from '../../lib/middleware/configuration';
import async from 'async';
import path from 'path';
import jade from 'jade';

var viewname = path.resolve(__dirname, '../../views/doc-embedded.jade');

export default function(req, res) {
  return {
    loadArticle: function(payload) {
      return new Promise((resolve, reject) => {
        var req2 = {
          query: {},
          locals: req.locals || {},
          url: `/${getPlatformSlug(payload.appType)}/${payload.currentTech}`
        };
        console.log(req2)
        req2.query[payload.appType] = payload.tech1;
        if(payload.tech2) {
          req2.query.api = payload.tech2;
        }

        middlewares.push(setConfiguration);

        async.eachSeries(middlewares, (middleware, next) => {
          middleware(req2, res, next);
        }, (err) => {
          if (err) {
            return reject(err);
          }
          res.locals.sections = res.doc.processSections(res.locals, true /* absolute links */);
          var options = {};
          Object.keys(res.locals).forEach(function(key) {
            options[key] = res.locals[key];
          });
          options.doc = res.doc;

          jade.renderFile(viewname, options, function(err, html) {
            if (err) {
              return reject(err);
            } else {
              return resolve(html);
            }
          });
        });
      });
    }
  };
}
