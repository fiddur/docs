class AutoTitlePlugin {

  constructor(options = {}) {
    this.regex = options.regex || /\#{1}[^\n\#]+/g;
    this.defaultTitle = options.defaultTitle || 'Document';
  }

  getMetadata(meta, content) {

    if (!meta.title) {
      let match = content.match(this.regex);
      if (match && match.length) {
        let title = match[0].slice(1).trim();
        return {title};
      }
      else {
        return {title: this.defaultTitle};
      }
    }

  }

}

export default AutoTitlePlugin;
