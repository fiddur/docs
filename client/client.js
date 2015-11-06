/*global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import { createElementWithContext } from 'fluxible-addons-react';
import app from './app';
import { Constants, articleService } from 'auth0-tutorial-navigator';

require('./styles/docs.styl');

const debugClient = debug('docs:react');
const dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support

// expose debug object to browser, so that it can be enabled/disabled from browser:
// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug;


// Register services
app.getPlugin('ServiceProxyPlugin').registerService(Constants.ArticleServiceName, articleService);

debugClient('rehydrating app');

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, (err, context) => {
    if (err) {
        throw err;
    }
    window.context = context;
    const mountNode = document.getElementById('app');

    debugClient('React Rendering');
    ReactDOM.render(
        createElementWithContext(context),
        mountNode,
        () => debugClient('React Rendered')
    );
});
