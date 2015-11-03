/* global $ */

require('./styles/docs.styl');

// We require the jquery.accordion.js here, rather than in
// ./browser/accordion because the jquery plugin is client only
// and can't be included in code that also runs on the server
require('./vendor/jquery.accordion.js');
import accordion from './browser/accordion';
import highlightCode from './browser/highlightCode';
import loadSdkSnippet from './browser/loadSdkSnippet';
import initFeedbackSender from './browser/feedbackSender';
import setAnchorLinks from './browser/anchorLinks';

$(function() {
  accordion();
  highlightCode();
  initFeedbackSender();
  setAnchorLinks();
  loadSdkSnippet({
    callbackOnHashMode: false,
    backend: window.CONFIG.sdkSnippet.backend,
    clientId: window.CONFIG.account.clientId,
  });
});
