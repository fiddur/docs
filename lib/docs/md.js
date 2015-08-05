import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

var renderer = new marked.Renderer();

// Warning blockquotes
// >! My Warning Here
renderer.blockquote = function(quote) {
  if (quote.indexOf('<p>!') === 0) {
    return '<blockquote class="warning">\n' + '<p>' + quote.substring(4) + '</blockquote>\n';
  } else {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }
};

export default function(text) {
  return marked(text, {
    renderer: renderer
  });
}
