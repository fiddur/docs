/* global jQuery */

const initLang = require('./app/_lang');
const initToc = require('./app/_toc');

export default function initApiExplorer() {
  initLang();
  initToc();
}

if (typeof window !== 'undefined') {
  window.initApiExplorer = initApiExplorer;
}
