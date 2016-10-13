class AutoUrlPlugin {

  getMetadata(doc, content) {
    if (!doc.url) {
      const url = doc.path.replace(/\.[\w]+$/, '').replace(/\/index$/, '');
      return { url };
    }

    return null;
  }

}

export default AutoUrlPlugin;
