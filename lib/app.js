import _ from 'lodash';
import express from 'express';
import { docsByUrl } from './docs/builder';
import { renderContent } from './docs/renderer'
import bootstrap from './bootstrap';

let router = express.Router();

// Add a special route for the homepage.
router.get('/', (req, res, next) => {
  bootstrap({}, req, res, next);
});

// Add a special route for search.
router.get('/search', (req, res, next) => {
  bootstrap({}, req, res, next);
})

// Add a special route for the SDKs page.
router.get('/sdks', (req, res, next) => {
  bootstrap({}, req, res, next);
})

// Add a special route for the quickstart selector (QuickstartsPage).
router.get('/quickstarts', (req, res, next) => {
  bootstrap({}, req, res, next);
})

// Add a special catch-all route for quickstarts, which are handled entirely by the client.
router.get('/quickstart/*', (req, res, next) => {
  bootstrap({}, req, res, next);
})

// Add an explicit route for each article.
_.each(docsByUrl, (doc, url) => {
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
});

export default router;
