/*global document, window */

require('babel-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import d from 'debug';
import { createElementWithContext } from 'fluxible-addons-react';
import app from './app';
import { ArticleService, ServiceKeys } from 'auth0-tutorial-navigator';
import ContentService from './services/ContentService.client';
import SearchService from './services/SearchService';

require('./styles/docs.styl');

const debug = d('docs:react');
const dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support

// expose debug object to browser, so that it can be enabled/disabled from browser:
// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug;

// Register services
let plugin = app.getPlugin('ServiceProxyPlugin');
plugin.registerService(ServiceKeys.ArticleService, ArticleService);
plugin.registerService('ContentService', ContentService);

debug('rehydrating app');

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, (err, context, props) => {

  if (err) {
    throw err;
  }

  window.context = context;

  const element = createElementWithContext(context);
  const mountPoint = document.getElementById('app');

  debug('React Rendering');
  ReactDOM.render(element, mountPoint, () => {
    debug('React Rendered')
  });

});
