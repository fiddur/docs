/* global $ */

require("babel-polyfill");
require('./styles/docs.styl');

import highlightCode from './browser/highlightCode';
import initFeedbackSender from './browser/feedbackSender';
import renderHeader from './browser/header';

$(function() {
  highlightCode();
  initFeedbackSender();

  // Render Auth0 Web Header, when DOM is ready (needs #header element)
  renderHeader();
});
