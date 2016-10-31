import _ from 'lodash';
import express from 'express';
import cache from './pipeline';
import bootstrap from './bootstrap';
import routes from '../client/configs/routes';

const router = new express.Router();

// Add an explicit route for each article.
cache.whenReady(() => {
  cache.forEach(doc => {
    router.get(doc.meta.url, (req, res, next) => {
      if (res.locals.embedded && req.headers['content-type'] === 'application/json') {
        const result = {
          html: doc.getContent(),
          meta: doc.toJSON()
        };
        res.json(result).end();
      } else if (res.locals.embedded) {
        res.type('html').send(doc.getContent()).end();
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
