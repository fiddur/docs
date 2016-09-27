class AutoTitlePlugin {

  constructor(options = {}) {
    this.regex = options.regex || /#{1}[^\n#]+/g;
    this.defaultTitle = options.defaultTitle || 'Document';
  }

  getMetadata(meta, content) {
    if (meta.title) {
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

export default AutoTitlePlugin;
