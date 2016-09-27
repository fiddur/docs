class AutoEditUrlPlugin {

  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://github.com/auth0/docs/edit/master/articles/';
  }

  getMetadata(meta, content) {
    if (!meta.editUrl) {
      return { editUrl: this.baseUrl + meta.basename };
    }

    return null;
  }

}

export default AutoEditUrlPlugin;
