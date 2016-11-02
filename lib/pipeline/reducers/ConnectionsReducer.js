import assert from 'assert';
import { basename, dirname } from 'path';

class ConnectionsReducer {

  constructor(options = {}) {
    assert(options.urlFormatter, 'ConnectionsReducer constructor requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
  }

  reduce(cache) {
    return cache.find('articles/connections')
    .filter(doc => doc.meta.connection)
    .map(doc => ({
      title: doc.meta.connection,
      hash: doc.hash,
      url: this.urlFormatter.format(doc.meta.url),
      image: this.urlFormatter.format(doc.meta.image),
      type: basename(dirname(doc.filename)),
      alias: doc.meta.alias,
      seo_alias: doc.meta.seo_alias
    }));
  }

}

export default ConnectionsReducer;
