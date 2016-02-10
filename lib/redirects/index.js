import urls from '../../docs/redirect-urls';
import _ from 'lodash';
import express from 'express';
import redirect from 'express-redirect';

var router = redirect(express.Router());

_.each(urls, function(urlInfo) {
  router.redirect(urlInfo.from, '/docs' + urlInfo.to, 301);
});

router.use(function(req, res, next) {
  if (!/^\/new\//.exec(req.url)) return next();
  var url = req.url.replace(/^\/new/, '/docs');
  res.redirect(301, url);
});

export default router;