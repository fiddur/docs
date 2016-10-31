class AutoEditUrlPlugin {

  constructor(options = {}) {
    this.baseUrl = options.baseUrl || AutoEditUrlPlugin.defaults.baseUrl;
  }

  getMetadata(doc, content) {
    if (!doc.meta.editUrl) {
      return { editUrl: this.baseUrl + doc.hash };
    }

    return null;
  }

}

AutoEditUrlPlugin.defaults = {
  baseUrl: 'https://github.com/auth0/docs/edit/master/articles/'
};

export default AutoEditUrlPlugin;
