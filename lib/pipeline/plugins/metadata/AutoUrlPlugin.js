class AutoUrlPlugin {

  constructor(options = {}) {
    this.documentPathRegex = options.documentPathRegex || AutoUrlPlugin.defaults.documentPathRegex;
  }

  getMetadata(doc, content) {
    if (!doc.url) {
      const url = doc.path.replace(this.documentPathRegex, '');
      return { url };
    }

    return null;
  }

}

AutoUrlPlugin.defaults = {
  documentPathRegex: /^articles/
};

export default AutoUrlPlugin;
