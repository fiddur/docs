/* global $ */

require('babel-polyfill');
require('./styles/docs.styl');

import highlightCode from './browser/highlightCode';
import renderHeader from './browser/renderHeader';
import setAnchorLinks from './browser/anchorLinks';

$(function() {
  highlightCode();
  // Header needs to be rendered when DOM is ready (#header element)
  renderHeader();
  setAnchorLinks();
});
