class ReplaceMediaPathPlugin {

  constructor(options = {}) {
    this.prefix = options.prefix || ReplaceMediaPathPlugin.defaults.prefix;
    this.mediaUrl = options.mediaUrl || ReplaceMediaPathPlugin.defaults.mediaUrl;
  }

  transform(doc, content) {
    return content.replace(new RegExp(`src="\/${this.prefix}\/`, 'g'), `src="${this.mediaUrl}/`);
  }

}

ReplaceMediaPathPlugin.defaults = {
  prefix: 'media',
  mediaUrl: '/docs/media'
};

export default ReplaceMediaPathPlugin;
