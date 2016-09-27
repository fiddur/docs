class ReplaceMediaPathPlugin {

  constructor(options = {}) {
    this.mediaUrl = options.mediaUrl || '/docs/media';
  }

  transform(meta, content) {
    return content.replace(/src="\/media\//g, `src="${this.mediaUrl}/`);
  }

}

export default ReplaceMediaPathPlugin;
