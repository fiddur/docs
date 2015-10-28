/* global $ */

import hljs from 'highlight.js';

hljs.configure({
  classPrefix: ''
});


// https://github.com/wcoder/highlightjs-line-numbers.js
function lineNumbersBlock (element) {
  if (typeof element !== 'object') return;

  var parent = element.parentNode;
  var lines = getCountLines(parent.textContent);

  if (lines > 1) {
    var l = '';
    for (var i = 0; i < lines; i++) {
      l += (i + 1) + '\n';
    }

    var linesPanel = document.createElement('code');
    linesPanel.className = 'hljs hljs-line-numbers';
    linesPanel.style.float = 'left';
    linesPanel.textContent = l;

    parent.insertBefore(linesPanel, element);
  }
}

function getCountLines(text) {
  if (text.length === 0) return 0;

  var regExp = /\r\n|\r|\n/g;
  var lines = text.match(regExp);
  lines = lines ? lines.length : 0;

  if (!text[text.length - 1].match(regExp)) {
    lines += 1;
  }

  return lines;
}

hljs.lineNumbersBlock = lineNumbersBlock;

export default function highlightCode() {
  $('pre code').each(function(i, block) {
    var $snippet = $(this);

    if(!$snippet.hasClass('hljs')) {
      hljs.highlightBlock(block);
      hljs.lineNumbersBlock(block);
      $snippet.addClass('hljs');
    }
  });
}
