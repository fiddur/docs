import _ from 'lodash';
import express from 'express';
import { docsByUrl } from './docs/builder';
import { renderContent } from './docs/renderer'
import bootstrap from './bootstrap';

let router = express.Router();

router.get('/', (req, res, next) => {
  bootstrap({}, req, res, next);
});

router.get('/quickstarts', (req, res, next) => {
  bootstrap({}, req, res, next);
})

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
