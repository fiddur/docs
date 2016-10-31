class AutoSectionPlugin {

  constructor(options = {}) {
    this.section = options.section || AutoSectionPlugin.defaults.section;
  }

  getMetadata(doc, content) {
    if (!doc.meta.section) {
      return { section: this.section };
    }

    return null;
  }

}

AutoSectionPlugin.defaults = {
  section: 'articles'
};

export default AutoSectionPlugin;
