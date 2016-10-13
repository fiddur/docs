class AutoTitlePlugin {

  constructor(options = {}) {
    this.regex = options.regex || AutoTitlePlugin.defaults.regex;
    this.defaultTitle = options.defaultTitle || AutoTitlePlugin.defaults.defaultTitle;
  }

  getMetadata(doc, content) {
    if (doc.title) {
      return null;
    }

    const match = content.match(this.regex);
    if (match && match.length) {
      const title = match[0].slice(1).trim();
      return { title };
    }

    return { title: this.defaultTitle };
  }

}

AutoTitlePlugin.defaults = {
  regex: /#{1}[^\n#]+/g,
  defaultTitle: 'Document'
};

export default AutoTitlePlugin;
