import nconf from 'nconf';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
import loadSettingsAction from './actions/loadSettingsAction';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import app from './app';
import jade from 'jade';
import path from 'path';
import HtmlComponent from './components/Html';
import { createElementWithContext } from 'fluxible-addons-react';
import articleService from './services/articleService.server';

const env = process.env.NODE_ENV;
const htmlComponent = React.createFactory(HtmlComponent);

export default function middleware(req, res, next) {

  // Register services
  app.getPlugin('ServiceProxyPlugin').registerService('articleService', articleService(req, res));

  let context = app.createContext();

  var actionContext = context.getActionContext();
  actionContext.executeAction(navigateAction, {
    url: req.url
  }).then(actionContext.executeAction(loadSettingsAction, {
    baseUrl: nconf.get('BASE_URL'),
    quickstart: res.locals.quickstart,
    navigation: res.locals.navigation
  })).then(() => {
    const content = ReactDOMServer.renderToStaticMarkup(htmlComponent({
        clientFile: nconf.get('BASE_URL') + '/js/client.bundle.js',
        context: context.getComponentContext(),
        state: 'window.App=' + serialize(app.dehydrate(context)) + ';',
        markup: ReactDOMServer.renderToString(createElementWithContext(context))
    }));

    var options = {};
    Object.keys(res.locals).forEach(function(key) {
      options[key] = res.locals[key];
    });
    options.sections = { content: content };

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
