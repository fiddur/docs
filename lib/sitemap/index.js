import express from 'express';
import sitemap from 'sitemap';
import nconf from 'nconf';
import { parse as parseUrl } from 'url';
import { docUrls, docsByUrl } from '../docs/builder';
import quickstarts from '../collections/quickstarts';
import appTypes from '../data/app-types';
import _ from 'lodash';

var router = express.Router();

var urls = [];

// Add homepage
urls.push('/docs');

// Add quickstarts
_.values(quickstarts).forEach(quickstart => {
  let baseRoute = '/' + quickstart.name;
  urls.push('/docs/quickstart' + baseRoute);
  let platforms = _.values(quickstart.platforms).sort((a, b) => a.title - b.title);
  platforms.forEach(platform => {
    let platformRoute = baseRoute + '/' + platform.name;
    urls.push('/docs/quickstart' + platformRoute);
    platform.articles.forEach((article, i) => {
      if (i > 1) {
        let articleRoute = platformRoute + '/' + article.name;
        urls.push('/docs/quickstart' + articleRoute);
      }
    });
  });
});

function isQuickstartContent(url) {
  var isMatch = false;
  appTypes.forEach(function(appType) {
    if (isMatch) {
      return;
    }
    isMatch = url.indexOf(`/${appType.slug}/`) === 0;
  })
  return isMatch;
}

// Add articles
// NOTE: We dont serve the raw content of quickstarts directly so we filter
// these articles out here via the isQuickstartContent().
docUrls.forEach(url => {
  var doc = docsByUrl[url];
  if (doc.meta.sitemap !== false && !isQuickstartContent(url)) {
    urls.push('/docs' + url);
  }
});

// Create sitemap
var map = sitemap.createSitemap({
  hostname: `${parseUrl(nconf.get('DOMAIN_URL_DOCS')).protocol}//${parseUrl(nconf.get('DOMAIN_URL_DOCS')).host}`,
  cacheTime: 600000,
  urls: urls
});

var xml = map.toString();

router.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
