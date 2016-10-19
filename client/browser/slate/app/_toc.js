require('jquery');
require('../lib/_jquery_ui');
require('../lib/_jquery.tocify');
//require('../lib/_imagesloaded.min');


var closeToc = function() {
  $(".tocify-wrapper").removeClass('open');
  $("#nav-button").removeClass('open');
};

export function makeToc() {
  window.toc = $("#toc").tocify({
    context: $('.api-content'),
    selectors: 'h1, h2',
    extendPage: false,
    theme: 'none',
    smoothScroll: false,
    showEffectSpeed: 0,
    hideEffectSpeed: 180,
    ignoreSelector: '.toc-ignore',
    highlightOffset: 60,
    scrollTo: -1,
    scrollHistory: true,
    hashGenerator: function (text, element) {
      return element.prop('id');
    }
  }).data('toc-tocify');

  $("#nav-button").click(function() {
    $(".tocify-wrapper").toggleClass('open');
    $("#nav-button").toggleClass('open');
    return false;
  });

  $(".page-wrapper").click(closeToc);
  $(".tocify-item").click(closeToc);
};

// Hack to make already open sections to start opened,
// instead of displaying an ugly animation
export function animateToc() {
  setTimeout(function() {
    toc.setOption('showEffectSpeed', 180);
  }, 50);
}
