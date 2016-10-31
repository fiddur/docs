class AutoUrlPlugin {

  constructor(options = {}) {
    this.documentPathRegex = options.documentPathRegex || AutoUrlPlugin.defaults.documentPathRegex;
  }

  getMetadata(doc, content) {
    if (!doc.meta.url) {
      const url = doc.path
      .replace(this.documentPathRegex, '')
      .replace(/\.[\w]+$/, '')
      .replace(/\/index$/, '');
      return { url };
    }

    return null;
  }

}

AutoUrlPlugin.defaults = {
  documentPathRegex: /^articles/
};

export default AutoUrlPlugin;
