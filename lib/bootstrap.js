import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import d from 'debug';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadSettingsAction, ServiceKeys } from 'auth0-tutorial-navigator';
import app from '../client/app';
import Layout from '../client/components/Layout';
import loadContent from '../client/action/loadContent';
import loadError from '../client/action/loadError';
import loadEnvironment from '../client/action/loadEnvironment';
import loadNavigation from '../client/action/loadNavigation';
import ContentService from '../client/services/ContentService.server';
import ArticleService from '../client/services/articleService.server';
import LoggingService from '../client/services/LoggingService.server';
import quickstarts from './collections/quickstarts';
import navigation from './data/navigation';
import getEnvironmentVars from './vars';

let debug = d('docs:docs');
let LayoutComponent = React.createFactory(Layout);

/**
 * This function performs two renders in order to bootstrap the React client application.
 * 
 * First, it renders the basic Layout element which acts as the framework for the page itself.
 * Second, it renders the React client and mounts it within the Layout.
 * 
 * The options argument is an object that must contain one of the following properties:
 *   doc: The document to render, or
 *   err: The error to display
 * 
 */
export default function bootstrap(options, req, res, next) {

  let {doc, err} = options;

  let context = app.createContext({debug: process.env.NODE_ENV !== 'production'});
  let env = getEnvironmentVars(req, res);
  let url = '/docs' + req.url;

  let plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('LoggingService', LoggingService(req, res));
  plugin.registerService('ContentService', ContentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, ArticleService(req, res));

  context
  .executeAction(navigateAction, { method: 'get', url })
  .then(context.executeAction(loadEnvironment, { env, user: res.locals.user }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {
    if (err) return context.executeAction(loadError, { url, err })
  })
  .then(() => {

    let layoutProps = {
      env,
      header:        res.locals.webheader,
      footer:        res.locals.webfooter,
      site:          res.locals.site,
      abExperiments: res.locals.abExperiments,
      state:         `window.App=${serialize(app.dehydrate(context))};`,
      markup:        ReactDOMServer.renderToString(createElementWithContext(context)),
    };

    if (doc) {
      layoutProps.pageTitle = doc.meta.title;
      layoutProps.pageDescription = doc.meta.description;
    }

    let html = ReactDOMServer.renderToString(LayoutComponent(layoutProps));
    
    res.type('html')
    .status(err ? err.status : 200)
    .send('<!DOCTYPE html>' + html)
    .end();

  })
  .catch(next);

}
