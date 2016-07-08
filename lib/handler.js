import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import url from 'url';
import d from 'debug';
import _ from 'lodash';
import { docsByUrl, docUrls } from './docs/builder';
import app from '../client/app';
import Layout from '../client/components/Layout';
import loadDocument from '../client/action/loadDocument';
import loadEnvironment from '../client/action/loadEnvironment';
import loadNavigation from '../client/action/loadNavigation';
import DocumentService from '../client/services/DocumentService.server';
import ArticleService from '../client/services/ArticleService.server';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadSettingsAction, ServiceKeys } from 'auth0-tutorial-navigator';
import quickstarts from './collections/quickstarts';
import getEnvironmentVars from './vars';

let debug = d('docs:docs');
let LayoutComponent = React.createFactory(Layout);

function renderApp(req, res, next) {

  let context = app.createContext({
    debug: process.env.NODE_ENV !== 'production'
  });

  let plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('DocumentService', DocumentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, ArticleService(req, res));

  let env = getEnvironmentVars(req, res);

  context.executeAction(navigateAction, { method: 'get', url: '/docs' + req.url })
  .then(context.executeAction(loadEnvironment, { env }))
  .then(context.executeAction(loadDocument, { url: req.url }))
  .then(context.executeAction(loadNavigation, { navigation: res.locals.navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts: quickstarts }))
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

function renderContentOnly(req, res, next) {

  let url = '/docs' + req.url;
  let documentService = DocumentService(req, res);

  documentService.loadDocument(url).then(html => {
    res.type('html');
    res.write(html);
    res.end();
  }).catch(err => {
    next(err);
  });

}

export default function(req, res, next) {
  
  // If the document was requested in embedded mode, just return the HTML content.
  // Otherwise, initialize the React app to display it.
  if (res.locals.embedded) {
    return renderContentOnly(req, res, next);
  }
  else {
    return renderApp(req, res, next);
  }

}
