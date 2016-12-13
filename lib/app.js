import _ from 'lodash';
import express from 'express';
import nconf from 'nconf';
import cache from './pipeline';
import bootstrap from './bootstrap';
import routes from '../client/configs/routes';
import replaceUserVars from './replaceUserVars';

const router = new express.Router();
const baseUrl = nconf.get('DOMAIN_URL_DOCS');

// Add an explicit route for each public article.
cache.whenReady(() => {
  cache.forEach(doc => {
    if (!doc.public) return;
    const mountPoint = doc.url.replace(baseUrl, '');
    router.get(mountPoint, (req, res, next) => {
      if (res.locals.embedded) {
        if (req.headers['content-type'] === 'application/json') {
          const result = {
            html: doc.getContent(),
            meta: doc.toJSON()
          };
          res.json(result).end();
        } else {
          // TODO: This case is deprecated and should be removed once the management site
          // is using framed mode.
          const html = replaceUserVars(doc.getContent(), res.locals);
          res.type('html').send(html).end();
        }
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
