import Tree from '../models/Tree';

class ArticlesReducer {

  reduce(cache) {
    const result = new Tree();

    cache.forEach(doc => {
      const path = doc.shortname.replace(/^articles/, '').replace(doc.extension, '');
      result.add(path, doc.getMetadata());
    });

    return result;
  }

}

export default ArticlesReducer;
