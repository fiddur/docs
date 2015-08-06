import lsr from 'lsr';
import fspath from 'path';
import nconf from 'nconf';
import url from 'url';
import jade from 'jade';
import express from 'express';
import Doc from './doc';
import * as middleware from '../middleware';
import { middleware as quickstart } from '../quickstart';
import { alternative_title } from '../utils';

var router = express.Router();

const docsPath = nconf.get('DOCS_PATH') || fspath.resolve(__dirname, '../../docs/articles');
var docsByUrl = {};
var docsByFilename = {};
var docUrls = [];

function docsLocals(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  var doc = docsByUrl[pathname];

  res.locals.include = function(file, section) {
    var filename = fspath.join(fspath.dirname(doc.getFilename()), file) + '.md';
    section = section || 'content';
    var idoc = docsByFilename[filename];
    if (!idoc) {
      return '<span style="color: red;">ERROR: Could not find include ' + file + '.</span>';
    }
    //TODO: async
    var sections = idoc.processSections(res.locals);
    return sections[section];
  };

  var sections = doc.getSections();
  var title = doc.getMeta()['title'] || alternative_title(sections.content);
  var conanicalUrl = doc.getMeta()['canonical'];
  if (conanicalUrl) {
    conanicalUrl = nconf.get('DOMAIN_URL_DOCS') + nconf.get('BASE_URL') + conanicalUrl;
  }
  res.locals.canonicalUrl = conanicalUrl;
  res.locals.title = title;
  res.locals.meta = doc.getMeta();

  res.doc = doc;

  next();
}

function renderDoc(req, res) {
  res.locals.sections = res.doc.processSections(res.locals);
  var viewname = (res.doc.getMeta().layout || 'doc') + '.jade';
  if (res.locals.jsonp || res.locals.json) {
    viewname = (res.doc.getMeta().layout || 'doc.embedded') + '.jade';
    var options = {};
    Object.keys(res.locals).forEach(function(key) {
      options[key] = res.locals[key];
    });
    options.doc = res.doc;
    jade.renderFile(fspath.resolve(__dirname, '../../views', viewname), options, function(err, html) {
      if (err) {
        throw err;
      }
      var data = {
        html: html
      };
      if (res.locals.include_metadata) {
        data.metadata = res.doc.getMeta();
      }
      if (res.locals.jsonp) {
        res.jsonp(data);
      } else {
        res.json(data);
      }
    });
  } else if (res.locals.embedded) {
    viewname = (res.doc.getMeta().layout || 'doc.embedded') + '.jade';
    res.render(viewname, {});
  } else {
    res.render(viewname, {});
  }
}

var middlewares = [
  middleware.appendTicket,
  quickstart,
  require('../collections/articles').middleware,
  require('../collections/snippets').middleware,
  require('../collections/articles-tags').middleware,
  require('../sdk-snippets/login-widget/middleware'),
  require('../sdk-snippets/login-widget2/middleware'),
  require('../sdk-snippets/lock/middleware-browser'),
  require('../sdk-snippets/lock/middleware'),
  docsLocals
];


lsr
  .sync(docsPath)
  .forEach(function(fileStat) {
    var filename = fileStat.path;
    if (!/\.md$/.test(filename)) return;

    var doc = new Doc(docsPath, filename);
    var url = doc.getUrl();
    docsByUrl[url] = doc;
    docsByFilename[doc.getFilename()] = doc;

    if (doc.isPublic() && doc.getMeta().sitemap !== false) {
      docUrls.push(url);
    }

    if (doc.isPublic()) {
      router.get(url, middlewares, renderDoc);
    }

  });

export { docUrls, router };
