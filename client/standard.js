/* global $ */

require("babel-polyfill");
require('./styles/docs.styl');

import highlightCode from './browser/highlightCode';
import initFeedbackSender from './browser/feedbackSender';
import setAnchorLinks from './browser/anchorLinks';

$(function() {
  highlightCode();
  initFeedbackSender();
  setAnchorLinks();
});
