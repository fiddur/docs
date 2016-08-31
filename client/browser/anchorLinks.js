/* global $ */

export default function setAnchorLinks() {
  $('body').on('click', '.docs-content .anchor-heading', function() {
    if($(this).attr('id') && !$(this).is('h1')) {
      window.location.hash = $(this).attr('id');
    }
  })
}
