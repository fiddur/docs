/* global jQuery */
import _ from 'lodash';
import { setupLanguages, initEvents } from './app/_lang';
import { makeToc, animateToc } from './app/_toc';

function addTocHeaders() {
  const sections = $('div[data-section]');

  $('span[data-section-label]').each((i, element) => {
    const el = $(element);
    const section = el.attr('data-section-label');
    const title = el.text().trim();
    el.remove();

    const index = _.findIndex(sections, (sec) =>
       $(sec).attr('data-section') === section
    );

    $(`<div class="title">${title}</div>`).insertBefore(`#tocify-header${index}`);
  });
}

export default function initApiExplorer(languages) {
  makeToc();
  addTocHeaders();
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
