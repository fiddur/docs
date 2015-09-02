import express from 'express';
import sitemap from 'express-sitemap';
import nconf from 'nconf';
import { parse as parseUrl } from 'url';

var router = express.Router();

export default function sitemapRoute(app) {

  // Sitemap
  var map = sitemap({
    generate: app,
    url: parseUrl(nconf.get('DOMAIN_URL_DOCS')).host,
    cache: 60000,
    route: {
      'ALL': {
        changefreq: 'weekly',
      }
    }
  });

  router.get('/sitemap.xml', function(req, res) {
    map.XMLtoWeb(res);
  });

  return router;
}
