import express from 'express';
import sitemap from 'sitemap';
import nconf from 'nconf';
import { parse as parseUrl } from 'url';
import { docUrls, docsByUrl } from '../docs/builder';
import { routes as quickstartUrls } from '../quickstart';

var router = express.Router();

var urls = [];

// Add homepage
urls.push('/docs');

// Add articles
docUrls.forEach(url => {
  var doc = docsByUrl[url];
  if (doc.meta.sitemap !== false) {
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
