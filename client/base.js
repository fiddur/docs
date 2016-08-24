/* global $ */

require('babel-polyfill');
require('./styles/docs.styl');

import highlightCode from './browser/highlightCode';
import renderHeader from './browser/header';

$(function() {
  highlightCode();

  // Render Auth0 Web Header, when DOM is ready (needs #header element)
  renderHeader();
});
