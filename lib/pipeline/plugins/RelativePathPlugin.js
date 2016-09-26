class RelativePathPlugin {

  transform(meta, content) {

    if (isParsingAnInclude()) {
      return content;
    }
    else {
      return content.replace(/href="\//g, 'href="/docs/');
    }
    
  }

}

// TODO: Is there another way to do this?
function isParsingAnInclude() {
  let err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

export default RelativePathPlugin;
