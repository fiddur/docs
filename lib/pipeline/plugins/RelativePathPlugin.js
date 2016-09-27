class RelativePathPlugin {

  transform(meta, content) {
    if (!isParsingAnInclude()) {
      return content.replace(/href="\//g, 'href="/docs/');
    }

    return content;
  }

}

// TODO: Is there another way to do this?
function isParsingAnInclude() {
  const err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

export default RelativePathPlugin;
