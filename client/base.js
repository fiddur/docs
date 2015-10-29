/* global $ */

require('./styles/docs.styl');

import highlightCode from './browser/highlightCode';

$(function() {
  highlightCode();
});
