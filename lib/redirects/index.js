import { isArray } from 'lodash';
import express from 'express';
import redirect from 'express-redirect';
import urljoin from 'url-join';
import redirects from '../../docs/config/redirects';

const router = redirect(new express.Router());

redirects.forEach(item => {
  const from = isArray(item.from) ? item.from : [item.from];
  from.forEach(url => {
    const to = urljoin('/docs', item.to);
    router.redirect(url, to, item.status || 301, true /* keep query string */);
  });
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
