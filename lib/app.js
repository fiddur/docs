import _ from 'lodash';
import express from 'express';
import cache from './pipeline';
import bootstrap from './bootstrap';
import routes from '../client/configs/routes';
import replaceUserVars from './replaceUserVars';

const router = new express.Router();

// Add an explicit route for each public article.
cache.whenReady(() => {
  cache.forEach(doc => {
    if (!doc.public) return;
    router.get(doc.url, (req, res, next) => {
      if (res.locals.embedded && req.headers['content-type'] === 'application/json') {
        const result = {
          html: replaceUserVars(doc.getContent(), res.locals),
          meta: doc.toJSON()
        };
        res.json(result).end();
      } else if (res.locals.embedded) {
        const html = replaceUserVars(doc.getContent(), res.locals);
        res.type('html').send(html).end();
      } else {
        bootstrap({ doc }, req, res, next);
      }
    });
  });
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
