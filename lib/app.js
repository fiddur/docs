import _ from 'lodash';
import express from 'express';
import { docsByUrl } from './docs/builder';
import { renderContent } from './docs/renderer';
import bootstrap from './bootstrap';
import routes from '../client/configs/routes';

const router = new express.Router();

// Add an explicit route for each article.
_.each(docsByUrl, (doc, url) => {
  if (doc.meta.public) {
    router.get(url, (req, res, next) => {
      if (res.locals.embedded) {
        const context = _.clone(res.locals);
        const html = renderContent(doc, context, true /* absolute links */);
        res.type('html').send(html).end();
      } else if (req.headers['content-type'] === 'application/json') {
        const context = _.clone(res.locals);
        const html = renderContent(doc, context, true /* absolute links */);
        const result = {
          html,
          meta: _.clone(doc.meta)
        };
        res.json(result).end();
      } else {
        bootstrap({ doc }, req, res, next);
      }
    });
  }
});

// Read the fluxible route table and register matching express routes
// for all "special" pages (homepage, quickstarts, search, etc.)
_.each(routes, (route) => {
  const path = route.path.replace(/^\/docs/, '');
  if (path !== '/*') {
    router.get(path, (req, res, next) => {
      bootstrap({}, req, res, next);
    });
  }
});

export default router;
