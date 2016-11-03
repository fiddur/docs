import assert from 'assert';
import { basename, dirname } from 'path';

class ConnectionsReducer {

  constructor(options = {}) {
    assert(options.urlFormatter, 'ConnectionsReducer constructor requires a urlFormatter option');
    this.urlFormatter = options.urlFormatter;
  }

  reduce(cache) {
    return cache.find('articles/connections')
    .filter(doc => doc.connection)
    .map(doc => ({
      title: doc.connection,
      hash: doc.hash,
      url: this.urlFormatter.format(doc.url),
      image: this.urlFormatter.format(doc.image),
      type: basename(dirname(doc.filename)),
      alias: doc.alias,
      seo_alias: doc.seo_alias
    }));
  }

}

export default ConnectionsReducer;
