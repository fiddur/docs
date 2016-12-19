import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import d from 'debug';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import { parse } from 'url';
import { pick } from 'lodash';
import docs from './pipeline';
import app from '../client/app';
import Layout from '../client/components/Layout';
import loadDocument from '../client/action/loadDocument';
import loadError from '../client/action/loadError';
import loadModeFlags from '../client/action/loadModeFlags';
import loadNavigation from '../client/action/loadNavigation';
import loadStaticContent from '../client/action/loadStaticContent';
import loadUser from '../client/action/loadUser';
import DocumentService from '../client/services/DocumentService.server';
import LoggingService from '../client/services/LoggingService.server';
import NavigationService from '../client/services/NavigationService.server';
import getPageMetadata from '../client/util/getPageMetadata';
import { sidebar, sections } from './data/navigation';
import strings from './strings';
import vars from './vars';

const debug = d('docs:docs');
const createLayoutComponent = React.createFactory(Layout);

const getUser = (req, res) => {
  const { account, connectionName } = res.locals;
  return {
    account: {
      userName: account.userName,
      appName: account.appName,
      tenant: account.tenant,
      namespace: account.namespace,
      clientId: account.clientId,
      clientSecret: account.clientSecret,
      callback: account.callback
    },
    connectionName
  };
};

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
  const env = Object.assign({}, vars.env);
  const flags = pick(res.locals, ['framed', 'singleQuickstart']);
  const url = `/docs${req.url}`;
  const user = getUser(req, res);

  let pageTitle = doc ? doc.title : undefined;
  let pageDescription = doc ? doc.description : undefined;
  let pageCanonicalUrl = doc ? doc.canonical : undefined;
  let fullWidth = doc ? doc.fullWidth : false;

  const plugin = app.getPlugin('ServiceProxyPlugin');
  plugin.registerService('DocumentService', DocumentService);
  plugin.registerService('LoggingService', LoggingService);
  plugin.registerService('NavigationService', NavigationService);

  context
  .executeAction(navigateAction, { method: 'get', url })
  .then(context.executeAction(loadModeFlags, { flags }))
  .then(context.executeAction(loadUser, { user }))
  .then(context.executeAction(loadNavigation, { sidebar, sections }))
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
      const quickstarts = docs.getReduction('quickstarts');
      return getPageMetadata(quickstarts, quickstartId, platformId, articleId).then(metadata => {
        pageTitle = metadata.pageTitle;
        pageDescription = metadata.pageDescription;
        pageCanonicalUrl = metadata.pageCanonicalUrl;
      });
    }
    return null;
  })
  .then(() => {
    // If we are using static content, no doc will be present
    if (staticPage) {
      pageTitle = staticPage.meta.title;
      pageDescription = staticPage.meta.description;
      pageCanonicalUrl = staticPage.meta.canonical;
      fullWidth = staticPage.meta.fullWidth;
      return context.executeAction(loadStaticContent, { content: staticPage });
    }
    return null;
  })
  .then(() => {
    const layoutProps = {
      env,
      flags,
      fullWidth,
      pageTitle,
      pageDescription,
      pageCanonicalUrl,
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
