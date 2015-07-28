/**
 * Module dependencies.
 */

var fs = require('fs');
var ejs = require('ejs');
var read = fs.readFileSync;
var qsroutes = require('../quickstart').routes;
var tmplPath = __dirname + '/sitemap.xml.ejs';
var tmplString = read(tmplPath, 'utf8');
var sitemap = ejs.compile(tmplString);
var debug = require('debug')('docs:sitemap');
var nconf = require('nconf');
var docUrls = require('../doc-urls');
var express = require('express');
var router = express.Router();


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

qsroutes.forEach(function(r) {
  var url = '/quickstart' + r;
  debug('adding %s', url);
  urls.push(url);
});

/**
 * Export `Express` app function wrapper
 */

router.get('/sitemap.xml', function (req, res) {
  res.set('Content-Type', 'application/xml');
  res.send(sitemap({ urls: urls }));
});

export default router;
