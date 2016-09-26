import d from 'debug';
import _ from 'lodash';

const debug = d('docs:cache');

class Cache {

  constructor() {
    this.docsByUrl = {};
    this.docsByPath = {};
    this.publicUrls = [];
  }

  add(docs) {

    if (!_.isArray(docs)) docs = [docs];

    docs.forEach(doc => {
      debug(`added ${doc.meta.path} at url ${doc.meta.url}`);

      this.docsByUrl[doc.meta.url] = doc;
      this.docsByPath[doc.meta.path] = doc;
      if (doc.meta.public) {
        this.publicUrls.push(doc.meta.url);
      }
    });

  }

  get(options) {
    if (options.url)      return this.docsByUrl[options.url];
    if (options.path)     return this.docsByPath[options.path];
    if (options.filename) return this.docsByPath[options.filename];
    throw new Error("Calls to Cache.get() must include url, path, or filename");
  }

}

export default Cache;
