class AutoEditUrlPlugin {

  constructor(options = {}) {
    this.baseUrl = options.baseUrl || AutoEditUrlPlugin.defaults.baseUrl;
  }

  getMetadata(doc, content) {
    if (!doc.editUrl) {
      return { editUrl: this.baseUrl + doc.shortname };
    }

    return null;
  }

}

AutoEditUrlPlugin.defaults = {
  baseUrl: 'https://github.com/auth0/docs/edit/master/'
};

export default AutoEditUrlPlugin;
