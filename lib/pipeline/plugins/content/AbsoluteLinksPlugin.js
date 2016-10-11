import assert from 'assert';

class AbsoluteLinksPlugin {

  constructor(options = {}) {
    assert(options.domain, 'AbsoluteLinksPlugin constructor requires a domain option');
    this.domain = options.domain;
  }

  transform(meta, content) {
    return content
    .replace(/href="\//g, `href="${this.domain}/`)
    .replace(/src="(\/[^\/]+)/ig, `src="${this.domain}$1`);
  }

}

export default AbsoluteLinksPlugin;
