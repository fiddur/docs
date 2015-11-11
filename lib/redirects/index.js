import urls from '../../docs/redirect-urls';
import _ from 'lodash';
import express from 'express';
import redirect from 'express-redirect';
import nconf from 'nconf';

var router = redirect(express.Router());

_.each(urls, function(urlInfo) {
  router.redirect(urlInfo.from, urlInfo.to, 301);
});

router.use(function(req, res, next) {
  if (!/^\/new/.exec(req.url)) return next();
  var url = req.url.replace(/^\/new/, '');
  res.redirect(301, url);
});

export default router;
