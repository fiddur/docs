import serialize from 'serialize-javascript';
import { navigateAction } from 'fluxible-router';
import { loadSettingsAction, Constants } from 'auth0-tutorial-navigator';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import app from './app';
import jade from 'jade';
import path from 'path';
import HtmlComponent from './components/Html';
import ApplicationStore from './stores/ApplicationStore';
import { createElementWithContext } from 'fluxible-addons-react';
import articleService from './services/articleService.server';
import { getAssetBundleUrl } from '../lib/utils';
import loadUserAction from './action/loadUserAction';

const htmlComponent = React.createFactory(HtmlComponent);

export default function middleware(req, res, next) {

  // Register services
  app.getPlugin('ServiceProxyPlugin').registerService(Constants.ArticleServiceName, articleService(req, res));

  let context = app.createContext();
  var actionContext = context.getActionContext();

  actionContext.executeAction(navigateAction, {
    url: req.url
  }).then(actionContext.executeAction(loadSettingsAction, {
    quickstart: res.locals.quickstart,
    navigation: res.locals.navigation
  })).then(() => {
    if (req.user) {
      return actionContext.executeAction(loadUserAction, {
        user: {
          id: req.user.id,
          email: req.user.email
        }
      });
    }
  }).then(() => {
    var componentContext = context.getComponentContext();
    const content = ReactDOMServer.renderToStaticMarkup(htmlComponent({
      clientFile: getAssetBundleUrl('client'),
      context: componentContext,
      state: 'window.App=' + serialize(app.dehydrate(context)) + ';',//window.NavigateAction=' + navigateAction +';',
      markup: ReactDOMServer.renderToString(createElementWithContext(context))
    }));

    var appStore = componentContext.getStore(ApplicationStore);

    var options = {};
    Object.keys(res.locals).forEach(function(key) {
      options[key] = res.locals[key];
    });
    options.sections = { content: content };
    options.title = appStore.getPageTitle();
    options.description = appStore.getPageDescription();

    jade.renderFile(path.resolve(__dirname, '../views/homepage.jade'), options, function(err, html) {
      if (err) {
        return next(err);
      }
      res.type('html');
      res.write(html);
      res.end();
    });
  }).catch((err) => {
    if (err.statusCode && err.statusCode === 404) {
      next();
    } else {
      next(err);
    }
  });
}
