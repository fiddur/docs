import React, { createElement } from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
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
import ApplicationStore from '../client/stores/ApplicationStore';
import ContentService from '../client/services/ContentService.server';
import ArticleService from '../client/services/articleService.server';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadSettingsAction, ServiceKeys } from 'auth0-tutorial-navigator';
import quickstarts from './collections/quickstarts';
import navigation from './data/navigation';
import getEnvironmentVars from './vars';
import strings from './strings';
import Header from '../universal/components/Header';

const debug = d('docs:docs');
const LayoutComponent = React.createFactory(Layout);
const isProduction = process.env.NODE_ENV === 'production';
const headerMarkup = renderToString(createElement(Header, null));

function serializeError(err) {
  let statusCode = err.status || 500;
  let title = err.status === 404 ? strings.PAGE_NOT_FOUND : strings.ERROR_PROCESSING_REQUEST;
  if (isProduction) {
    return { statusCode, title, message: title };
  }
  else {
    return { statusCode, title, message: err.message, stack: err.stack };
  }
}

function renderRaw(req, res, next) {

  let url = '/docs' + req.url;
  let contentService = ContentService(req, res);

  contentService.load(url).then(html => {
    res.type('html');
    res.write(html);
    res.end();
  }).catch(next);

}

function renderApp(req, res, next) {

  let context = app.createContext({debug: !isProduction});
  let env = getEnvironmentVars(req, res);

  let plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('ContentService', ContentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, ArticleService(req, res));

  context.executeAction(navigateAction, { method: 'get', url: '/docs' + req.url })
  .then(context.executeAction(loadEnvironment, { env, user: res.locals.user }))
  .then(context.executeAction(loadContent, { url: req.url, ignoreMissing: true }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {

    let appStore = context.getStore(ApplicationStore);

    let props = {
      env,
      pageTitle:       appStore.getPageTitle(),
      pageDescription: appStore.getPageDescription(),
      header:          headerMarkup,
      footer:          res.locals.webfooter,
      site:            res.locals.site,
      abExperiments:   res.locals.abExperiments,
      className:       (req.url == '' || req.url == '/') ? 'docs-home' : 'docs-single',
      state:           `window.App=${serialize(app.dehydrate(context))};`,
      markup:          ReactDOMServer.renderToString(createElementWithContext(context)),
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
  .then(context.executeAction(loadEnvironment, { env, user: res.locals.user }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {

    let error = serializeError(err);
    let appStore = context.getStore(ApplicationStore);

    let props = {
      env,
      pageTitle:       appStore.getPageTitle(),
      pageDescription: appStore.getPageDescription(),
      header:          headerMarkup,
      footer:          res.locals.webfooter,
      site:            res.locals.site,
      abExperiments:   res.locals.abExperiments,
      className:       (req.url == '' || req.url == '/') ? 'docs-home' : 'docs-single',
      state:           `window.App=${serialize(app.dehydrate(context))};`,
      markup:          ReactDOMServer.renderToString(createElementWithContext(context, {error})),
    };

    let html = ReactDOMServer.renderToString(LayoutComponent(props));
    res.type('html');
    res.write('<!DOCTYPE html>' + html);
    res.end();

  })
  .catch(next);

}

function renderRawError(err, req, res, next) {
  let error = serializeError(err);
  let html = `<h1>${error.title}</h1><h2>${error.status}</h2><pre>${error.stack}</pre>`;
  res.type('html');
  res.write(html);
  res.end();
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
