class AutoEditUrlPlugin {

  constructor(options = {}) {
    this.baseUrl = options.baseUrl || AutoEditUrlPlugin.defaults.baseUrl;
  }

  getMetadata(meta, content) {
    if (!meta.editUrl) {
      return { editUrl: this.baseUrl + meta.hash };
    }

    return null;
  }

}

AutoEditUrlPlugin.defaults = {
  baseUrl: 'https://github.com/auth0/docs/edit/master/articles/'
};

export default AutoEditUrlPlugin;
