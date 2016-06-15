import urls from '../../docs/redirect-urls';
import _ from 'lodash';
import express from 'express';
import redirect from 'express-redirect';
import platforms from '../data/platforms';

var router = redirect(express.Router());

_.each(urls, function(urlInfo) {
  router.redirect(urlInfo.from, '/docs' + urlInfo.to, 301);
});

// Object.keys(platforms).forEach((appType) => {
//   platforms[appType].forEach((platform) => {
//     if (platform.articles && platform.articles.length > 0) {
//       let platformUrl = platform.url.replace(/^\/docs/, '');
//       let firstArticleUrl = platform.articles[0].url;
//       router.redirect(platformUrl, firstArticleUrl);
//     }
//   });
// });

router.use(function(req, res, next) {
  if (!/^\/new\//.exec(req.url)) return next();
  var url = req.url.replace(/^\/new/, '/docs');
  res.redirect(301, url);
});

export default router;
