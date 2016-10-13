import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import d from 'debug';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadSettingsAction, ServiceKeys } from 'auth0-tutorial-navigator';
import { parse } from 'url';
import app from '../client/app';
import Layout from '../client/components/Layout';
import loadContent from '../client/action/loadContent';
import loadError from '../client/action/loadError';
import loadEnvironment from '../client/action/loadEnvironment';
import loadNavigation from '../client/action/loadNavigation';
import createContentService from '../client/services/ContentService.server';
import createArticleService from '../client/services/articleService.server';
import createLoggingService from '../client/services/LoggingService.server';
import { getPageMetadata } from '../client/util/metadata';
import quickstarts from './collections/quickstarts';
import navigation from './data/navigation';
import strings from './strings';
import getEnvironmentVars from './vars';
import loadStaticContent from '../client/action/loadStaticContent';

const debug = d('docs:docs');
const createLayoutComponent = React.createFactory(Layout);

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
  const { doc, err } = options;
  const { staticPage } = res.locals;

  const context = app.createContext({ debug: process.env.NODE_ENV !== 'production' });
  const env = getEnvironmentVars(req, res);
  const url = `/docs${req.url}`;

  const user = !req.user ? undefined : {
    id: req.user.id,
    email: req.user.email,
    tenant: req.user.tenant,
    regions: req.user.regions
  };

  let pageTitle = doc ? doc.meta.title : undefined;
  let pageDescription = doc ? doc.meta.description : undefined;

  const plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('LoggingService', createLoggingService(req, res));
  plugin.registerService('ContentService', createContentService(req, res));
  plugin.registerService(ServiceKeys.ArticleService, createArticleService(req, res));

  context
  .executeAction(navigateAction, { method: 'get', url })
  .then(context.executeAction(loadEnvironment, { env, user }))
  .then(context.executeAction(loadNavigation, { navigation }))
  .then(context.executeAction(loadSettingsAction, { quickstarts }))
  .then(() => {
    if (err) {
      return context.executeAction(loadError, { url, err });
    }
    return null;
  })
  .then(() => {
    // If we're loading a quickstart, the doc won't actually be present,
    // so we need to look up the metadata manually.
    if (url.indexOf('/docs/quickstart/') === 0) {
      const [quickstartId, platformId, articleId] = parse(url).pathname.split('/').slice(3);
      return getPageMetadata(quickstarts, quickstartId, platformId, articleId).then(metadata => {
        pageTitle = metadata.pageTitle;
        pageDescription = metadata.pageDescription;
      });
    }
    return null;
  })
  .then(() => {
    // If we are using static content, no doc will be present
    if (staticPage) {
      env.fullWidth = staticPage.meta.fullWidth || false;
      return context.executeAction(loadStaticContent, staticPage);
    }
    return null;
  })
  .then(() => {
    const layoutProps = {
      env,
      pageTitle,
      pageDescription,
      site: res.locals.site,
      abExperiments: res.locals.abExperiments,
      state: `window.App=${serialize(app.dehydrate(context))};`,
      markup: ReactDOMServer.renderToString(createElementWithContext(context))
    };

    const html = ReactDOMServer.renderToString(createLayoutComponent(layoutProps));

    res.type('html')
    .status(err ? err.status : 200)
    .send(`<!DOCTYPE html>${html}`)
    .end();
  })
  .catch(next);
}
