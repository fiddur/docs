import { basename, dirname } from 'path';

class ConnectionsReducer {

  reduce(cache) {
    return cache.find('articles/connections')
    .filter(doc => doc.meta.connection)
    .map(doc => ({
      title: doc.meta.connection,
      hash: doc.hash,
      url: doc.meta.url,
      image: doc.meta.image,
      alias: doc.meta.alias,
      type: basename(dirname(doc.filename)),
      seo_alias: doc.meta.seo_alias
    }));
  }

}

export default ConnectionsReducer;
