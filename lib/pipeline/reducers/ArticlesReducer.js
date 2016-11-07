import Tree from '../models/Tree';

/**
 * Transforms a Cache into a Tree of article metadata.
 */
class ArticlesReducer {

  /**
   * Given a cache, returns a Tree of article metadata. The paths of the tree
   * are generated using the extensionless relative paths of the Documents in the cache.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Tree} The tree of document metadata read from the cache.
   */
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
