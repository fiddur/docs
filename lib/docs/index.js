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
const themePath = fspath.resolve(__dirname, '../../themes/default');
var docsByUrl = {};
var docsByFilename = {};
var docUrls = [];

function docsLocals(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  var doc = docsByUrl[pathname];

  res.locals.include = function(file, section) {
    var filename = fspath.join(fspath.dirname(doc.getFilename()), file) + '.md';
    console.log(filename);
    section = section || 'content';
    var idoc = docsByFilename[filename];
    if (!idoc) {
      return '<span style="color: red;">ERROR: Could not find include ' + file + '.</span>';
    }
    //TODO: async
    var sections = idoc.processSections(res.locals);
    return sections[section];
  };

  res.locals.furl = function(rurl) {
    var _baseUrl = nconf.get('BASE_URL');
    if (_baseUrl && rurl.indexOf('/') === 0) {
      if (rurl === '/')
        return _baseUrl;
      else
        return _baseUrl + rurl;
    }
    return rurl;
  };

  var settings = require(fspath.resolve(docsPath, '../settings.json'));
  var sections = doc.getSections();
  var title = doc.getMeta()['title'] || alternative_title(sections.content);
  var conanicalUrl = doc.getMeta()['canonical'];
  if (conanicalUrl) {
    conanicalUrl = nconf.get('DOMAIN_URL_DOCS') + nconf.get('BASE_URL') + conanicalUrl;
  }

  res.locals.site = {};
  res.locals.site.title = settings['title'] || 'Default';
  res.locals.site.menus = settings['menus'] || {};
  res.locals.title = title;
  res.locals.url = pathname;
  res.locals.meta = doc.getMeta();
  res.locals.canonicalUrl = conanicalUrl;
  res.locals.env = {
    BASE_URL: nconf.get('BASE_URL'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    COOKIE_SCOPE: nconf.get('COOKIE_SCOPE'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY')
  };

  res.doc = doc;

  next();
}

function renderDoc(req, res) {
  res.locals.sections = res.doc.processSections(res.locals);
  var viewname = (res.doc.getMeta().layout || 'doc') + '.jade';
  if (res.locals.jsonp || res.locals.json) {
    console.log('json');
    viewname = (res.doc.getMeta().layout || 'doc.embedded') + '.jade';
    var options = {};
    Object.keys(res.locals).forEach(function(key) {
      options[key] = res.locals[key];
    });
    options.doc = res.doc;
    jade.renderFile(fspath.resolve(themePath, 'views', viewname), options, function(err, html) {
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
    console.log()
    res.render(viewname, {});
  }
}

var middlewares = [
  middleware.defaultValues,
  middleware.overrideIfAuthenticated,
  middleware.overrideIfClientInQs,
  middleware.overrideIfClientInQsForPublicAllowedUrls,
  middleware.appendTicket,
  quickstart,
  middleware.embedded,
  require('../collections/articles').middleware,
  require('../collections/snippets').middleware,
  require('../collections/articles-tags').middleware,
  middleware.urlVariables,
  require('../external/middleware'),
  require('../external/api2-explorer-middleware'),
  require('../sdk-snippets/login-widget/middleware'),
  require('../sdk-snippets/login-widget2/middleware'),
  require('../sdk-snippets/lock/middleware-browser'),
  require('../sdk-snippets/lock/middleware'),
  middleware.configuration,
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
