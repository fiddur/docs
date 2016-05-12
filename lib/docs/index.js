import fspath from 'path';
import url from 'url';
import jade from 'jade';
import express from 'express';
import winston from 'winston';
import { docsByUrl, docUrls } from './builder';
import processSections from './renderer';
import d from 'debug';

let debug = d('docs:docs');
var router = express.Router();

function renderDoc(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  var doc = docsByUrl[pathname];

  if (!doc) {
    return next();
  }
  var viewname = (doc.meta.layout || 'doc') + '.jade';

  if (res.locals.jsonp || res.locals.json) {
    viewname = (doc.meta.layout || 'doc-embedded') + '.jade';
    res.locals.sections = processSections(doc, res.locals, true /* absolute links */);
    var jadeLocals = {};
    Object.keys(res.locals).forEach(function(key) {
      jadeLocals[key] = res.locals[key];
    });
    jadeLocals.doc = doc;
    jade.renderFile(fspath.resolve(__dirname, '../../views', viewname), jadeLocals, function(err, html) {
      if (err) {
        throw err;
      }
      var data = {
        html: html
      };
      if (res.locals.include_metadata) {
        data.metadata = doc.meta;
      }
      if (res.locals.jsonp) {
        res.jsonp(data);
      } else {
        res.json(data);
      }
    });
  } else if (res.locals.embedded) {
    viewname = (doc.meta.layout || 'doc-embedded') + '.jade';
    res.locals.sections = processSections(doc, res.locals, true /* absolute links */);
    res.render(viewname, {});
  } else if (res.locals.framed) {
    viewname = (doc.meta.layout || 'doc-framed') + '.jade';
    res.locals.sections = processSections(doc, res.locals, true /* absolute links */);
    res.render(viewname, {});
  } else {
    res.locals.sections = processSections(doc, res.locals);
    res.render(viewname, {});
  }
}

docUrls.map(url => {
  var doc = docsByUrl[url];
  if (doc.meta.public) {
    debug('adding route for %s', url);
    router.get(url, renderDoc);
  }
});


export default router;
