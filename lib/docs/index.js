import lsr from 'lsr';
import fspath from 'path';
import nconf from 'nconf';
import url from 'url';
import jade from 'jade';
import express from 'express';
import Doc from './doc';
import _ from 'lodash';
import * as middleware from '../middleware';
import { middleware as quickstart } from '../quickstart';
import winston from 'winston';

var router = express.Router();

const docsPath = nconf.get('DOCS_PATH') || fspath.resolve(__dirname, '../../docs');
var docsByUrl = {};
var docsByFilename = {};
var docUrls = [];

function docsLocals(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  var doc = docsByUrl[pathname];

  if (!doc) {
    winston.warn(`No document found at "${pathname}"`);
    return next();
  }

  res.locals.include = function(file, sectionOrContext, section) {
    var context = res.locals;
    if (sectionOrContext) {
      if (typeof sectionOrContext === 'string') {
        section = sectionOrContext;
      } else {
        context = _.merge(context, sectionOrContext);
      }
    }
    var filename = fspath.join(fspath.dirname(doc.getFilename()), file);
    section = section || 'content';
    var idoc = docsByFilename[filename  + '.md'];
    if (!idoc) {
      idoc = docsByFilename[filename  + '.html'];
    }
    if (!idoc) {
      throw new Error('Could not find include ' + file);
    }
    //TODO: async
    var sections = idoc.processSections(context);
    return sections[section];
  };

  var title = doc.getMeta()['title'];
  var conanicalUrl = doc.getMeta()['canonical'];
  if (conanicalUrl) {
    conanicalUrl = nconf.get('DOMAIN_URL_DOCS') + conanicalUrl;
  }
  res.locals.canonicalUrl = conanicalUrl;
  res.locals.title = title;
  res.locals.meta = doc.getMeta();
  res.locals.editUrl = 'https://github.com/auth0/docs/edit/master/articles/' + doc.getFilename();

  res.doc = doc;

  next();
}

function renderDoc(req, res, next) {
  if (!res.doc) {
    return next();
  }
  var viewname = (res.doc.getMeta().layout || 'doc') + '.jade';
  if (res.locals.jsonp || res.locals.json) {
    viewname = (res.doc.getMeta().layout || 'doc-embedded') + '.jade';
    res.locals.sections = res.doc.processSections(res.locals, true /* absolute links */);
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
    viewname = (res.doc.getMeta().layout || 'doc-embedded') + '.jade';
    res.locals.sections = res.doc.processSections(res.locals, true /* absolute links */);
    res.render(viewname, {});
  } else if (res.locals.framed) {
    viewname = (res.doc.getMeta().layout || 'doc-framed') + '.jade';
    res.locals.sections = res.doc.processSections(res.locals, true /* absolute links */);
    res.render(viewname, {});
  } else {
    res.locals.sections = res.doc.processSections(res.locals);
    res.render(viewname, {});
  }
}

var middlewares = [
  middleware.appendTicket,
  quickstart,
  require('../collections/articles').middleware,
  require('../collections/snippets').middleware,
  require('../collections/articles-tags').middleware,
  require('../sdk-snippets/lock/middleware').browser,
  require('../sdk-snippets/lock/middleware').index,
  docsLocals
];


lsr
  .sync(docsPath)
  .forEach(function(fileStat) {
    var filename = fileStat.path;
    if (!/\.(md|html)$/.test(filename)) return;

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

export { docsByUrl, docsByFilename, docUrls, router, middlewares };
