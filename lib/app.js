import _ from 'lodash';
import express from 'express';
import { docsByUrl } from './docs/builder';
import { renderContent } from './docs/renderer'
import bootstrap from './bootstrap';
import routes from '../client/configs/routes';

let router = express.Router();

// Add an explicit route for each article.
_.each(docsByUrl, (doc, url) => {
  if (doc.meta.public) {
    router.get(url, (req, res, next) => {
      if (res.locals.embedded) {
        let context = _.clone(res.locals);
        let html = renderContent(doc, context, true /* absolute links */);
        res.type('html').send(html).end();
      }
      else {
        bootstrap({doc}, req, res, next);
      }
    });
  }
});

// Read the fluxible route table and register matching express routes
// for all "special" pages (homepage, quickstarts, search, etc.)
_.each(routes, (route) => {
  let path = route.path.replace(/^\/docs/, '');
  if (path !== '/*') {
    router.get(path, (req, res, next) => {
      bootstrap({}, req, res, next);
    });
  }
});

export default router;
