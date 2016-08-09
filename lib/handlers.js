import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import url from 'url';
import d from 'debug';
import _ from 'lodash';
import { docsByUrl, docUrls } from './docs/builder';
import app from '../client/app';
import Layout from '../client/components/Layout';
import loadContent from '../client/action/loadContent';
import loadEnvironment from '../client/action/loadEnvironment';
import loadNavigation from '../client/action/loadNavigation';
import ContentService from '../client/services/ContentService.server';
import ArticleService from '../client/services/articleService.server';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadSettingsAction, ServiceKeys } from 'auth0-tutorial-navigator';
import quickstarts from './collections/quickstarts';
import navigation from './data/navigation';
import getEnvironmentVars from './vars';
import strings from './strings';

let debug = d('docs:docs');
let LayoutComponent = React.createFactory(Layout);
let isProduction = process.env.NODE_ENV === 'production';

function serializeError(err) {
  let status = err.status || 500;
  let title = err.status === 404 ? strings.PAGE_NOT_FOUND : strings.ERROR_PROCESSING_REQUEST;
  if (isProduction) {
    return { status, title, message: title };
  }
  else {
    return { status, title, message: err.message, stack: err.stack };
  }
}

function renderRaw(req, res, next) {

  let url = '/docs' + req.url;
  let contentService = ContentService(req, res);

  contentService.load(url).then(html => {
    res.type('html');
    res.write(html);
    res.end();
  }).catch(err => {
    next(err);
  });

}

function renderApp(req, res, next) {

  let context = app.createContext({debug: !isProduction});
  let env = getEnvironmentVars(req, res);

  let plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('ContentService', ContentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, ArticleService(req, res));

  context.executeAction(navigateAction, { method: 'get', url: '/docs' + req.url })
  .then(context.executeAction(loadEnvironment, { env }))
  .then(context.executeAction(loadContent, { url: req.url, ignoreMissing: true }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {

    let props = {
      env,
      header:        res.locals.webheader,
      footer:        res.locals.webfooter,
      site:          res.locals.site,
      abExperiments: res.locals.abExperiments,
      className:     (req.url == '' || req.url == '/') ? 'docs-home' : 'docs-single',
      state:         `window.App=${serialize(app.dehydrate(context))};`,
      markup:        ReactDOMServer.renderToString(createElementWithContext(context)),
    };

    let html = ReactDOMServer.renderToString(LayoutComponent(props));
    res.type('html');
    res.write('<!DOCTYPE html>' + html);
    res.end();

  })
  .catch(next);

}

function renderError(err, req, res, next) {

  let context = app.createContext({ debug: !isProduction });
  let env = getEnvironmentVars(req, res);

  let plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('ContentService', ContentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, ArticleService(req, res));

  context.executeAction(navigateAction, { method: 'get', url: '/error' })
  .then(context.executeAction(loadEnvironment, { env }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {

    let error = serializeError(err);

    try {
      let props = {
        env,
        header:        res.locals.webheader,
        footer:        res.locals.webfooter,
        site:          res.locals.site,
        abExperiments: res.locals.abExperiments,
        className:     (req.url == '' || req.url == '/') ? 'docs-home' : 'docs-single',
        state:         `window.App=${serialize(app.dehydrate(context))};`,
        markup:        ReactDOMServer.renderToString(createElementWithContext(context, {error})),
      };

      let html = ReactDOMServer.renderToString(LayoutComponent(props));
      res.type('html');
      res.write('<!DOCTYPE html>' + html);
      res.end();
    }
    catch (err) {
      // This is the worst case scenario. If we catch an error during rendering of the error page itself,
      // just write out a simple error message to avoid exposing a stack trace to production.
      if (isProduction) {
        res.type('html');
        res.write(strings.ERROR_PROCESSING_REQUEST);
        res.end();
      }
      else {
        next(err);
      }
    }

  });

}

function renderRawError(err, req, res, next) {
  try
  {
    let error = serializeError(err);
    let html = `<h1>${error.title}</h1><h2>${error.status}</h2><pre>${error.stack}</pre>`;
    res.type('html');
    res.write(html);
    res.end();
  }
  catch (err) {
    // This is the worst case scenario. If we catch an error during rendering of the error page itself,
    // just write out a simple error message to avoid exposing a stack trace to production.
    if (isProduction) {
      res.type('html');
      res.write(strings.ERROR_PROCESSING_REQUEST);
      res.end();
    }
    else {
      next(err);
    }
  }
}

let handlers = {};

handlers.content = (req, res, next) => {

  // If the document was requested in embedded mode, just return the HTML content.
  // Otherwise, initialize the React app to display it.
  if (res.locals.embedded) {
    return renderRaw(req, res, next);
  }
  else {
    return renderApp(req, res, next);
  }

};

handlers.error = (err, req, res, next) => {
  if (res.locals.embedded) {
    return renderRawError(err, req, res, next);
  }
  else {
    return renderError(err, req, res, next);
  }
};

export default handlers;