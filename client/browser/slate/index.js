/* global jQuery */

import { setupLanguages, initEvents } from './app/_lang';
import { makeToc, animateToc } from './app/_toc';

export default function initApiExplorer(languages) {
  makeToc();
  animateToc();
  initEvents();
  setupLanguages(languages);
  // $('.content').imagesLoaded( function() {
  //   window.toc.calculateHeights();
  // });
}

if (typeof window !== 'undefined') {
  window.initApiExplorer = initApiExplorer;
}
