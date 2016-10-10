class ReplaceMediaPathPlugin {

  constructor(options = {}) {
    this.mediaUrl = options.mediaUrl || ReplaceMediaPathPlugin.defaults.mediaUrl;
  }

  transform(meta, content) {
    return content.replace(/src="\/media\//g, `src="${this.mediaUrl}/`);
  }

}

ReplaceMediaPathPlugin.defaults = {
  mediaUrl: '/docs/media'
};

export default ReplaceMediaPathPlugin;
