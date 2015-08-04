/**
 * Module dependencies.
 */

import { readFileSync } from 'fs';
import ejs from 'ejs';
import { routes } from '../quickstart';
import docUrls from '../doc-urls';
import express from 'express';
import d from 'debug';

var debug = d('docs:sitemap');
var router = express.Router();
var tmplPath = __dirname + '/sitemap.xml.ejs';
var tmplString = readFileSync(tmplPath, 'utf8');
var sitemap = ejs.compile(tmplString);

var urls = [];

/**
 * Add docs routes
 */

docUrls.forEach(function(url) {
  urls.push(url);
})

/**
 * Add quickstart routes
 */

routes.forEach(function(r) {
  var url = '/quickstart' + r;
  debug('adding %s', url);
  urls.push(url);
});

/**
 * Export `Express` app function wrapper
 */

router.get('/sitemap.xml', function(req, res) {
  res.set('Content-Type', 'application/xml');
  res.send(sitemap({
    urls: urls
  }));
});

export default router;
