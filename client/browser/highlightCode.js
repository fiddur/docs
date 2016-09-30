/* global $ */

import hljs from 'highlight.js';

hljs.configure({
  classPrefix: ''
});

export default function highlightCode() {
  $('pre code').each((i, block) => {
    const $snippet = $(this);

    // Dont do highlight on auth api snippets
    if ($snippet.parents('.api-explorer.nocode').length) {
      return;
    }

    if (!$snippet.hasClass('hljs')) {
      hljs.highlightBlock(block);
      $snippet.addClass('hljs');
    }
  });
}

if (typeof window !== 'undefined') {
  window.highlightCode = highlightCode;
}
