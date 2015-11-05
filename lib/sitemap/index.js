import express from 'express';
import sitemap from 'sitemap';
import nconf from 'nconf';
import { parse as parseUrl } from 'url';
import { docUrls } from '../docs';
import { routes as quickstartUrls } from '../quickstart';

var router = express.Router();

var urls = [];

// Add homepage
urls.push(nconf.get('BASE_URL'));

// Add articles
docUrls.forEach(route => {
  urls.push(nconf.get('BASE_URL') + route)
});

// Add quickstarts
quickstartUrls.forEach(route => {
  urls.push(nconf.get('BASE_URL') + '/quickstart' + route);
});

// Create sitemap
var map = sitemap.createSitemap({
    hostname: `${parseUrl(nconf.get('DOMAIN_URL_DOCS')).protocol}//${parseUrl(nconf.get('DOMAIN_URL_DOCS')).host}`,
    cacheTime: 600000,
    urls: urls
  });

router.get('/sitemap.xml', function(req, res) {
  map.toXML(function(xml) {
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
});

export default router;