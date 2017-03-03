import _ from 'lodash';
import express from 'express';
import redirect from 'express-redirect';
import urls from '../../docs/config/redirect-urls';

const router = redirect(new express.Router());

_.each(urls, (urlInfo) => {
  router.redirect(
    urlInfo.from,
    `/docs/${urlInfo.to}`,
    urlInfo.status || 301,
    true /* keep query string */
  );
});

router.use((req, res, next) => {
  if (!/^\/new\//.exec(req.url)) {
    next();
  } else {
    const url = req.url.replace(/^\/new/, '/docs');
    res.redirect(301, url);
  }
});

export default router;
