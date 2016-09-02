function is_parsing_an_include() {
  var err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

/**
 * Relative path processor
 *
 * @param {String} text
 * @return {String} Processed text
 * @api public
 */
function relativePath(text) {
  if (is_parsing_an_include()) {
    return text;
  }

  return text.replace(/href="\//g, 'href="/docs/');
};

export default function compiler(options) {
  return relativePath;
}
