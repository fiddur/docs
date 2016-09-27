import _ from 'lodash';
import Reducer from './Reducer';

/**
 * A special type of Reducer that converts an array of Documents into a tree-like structure
 * that emulates the directory structure of the filesystem. For example:
 *
 * {
 *   hash: 'parent'
 *   items: [
 *     { hash: 'child1', items: [...] },
 *     { hash: 'child2', items: [...] }
 *   ]
 * }
 */
class Collection extends Reducer {

  constructor() {
    super();
    this.value = [];
  }

  reduce(value, doc) {
    const parts = doc.path.replace(doc.hash, '').split('/');

    // Find the insertion point in the tree.
    let current = this.value;
    parts.forEach(part => {
      let next = _.find(current.items, { hash: part });
      if (!next) {
        next = { hash: part, items: [] };
        current.items.push(next);
      }
      current = next;
    });

    // Call the transformer function to get the data we want to store in the collection.
    const item = this.map(doc);

    if (!item.hash) item.hash = parts[parts.length - 1];
    if (item.hash === 'index') {
      // If the item represents an index file, just merge its metadata into the tree.
      delete item.hash;
      _.merge(current, item);
    } else {
      // Insert the item as a child of the correct item.
      current.items = current.items || [];
      current.items.push(item);
    }
  }

  map(doc) {
    return doc;
  }

  findByHash(hash) {
    const parts = hash.split('/');
    let current = this.value;
    parts.forEach(part => {
      current = _.find(current.items, { hash: part });
    });
    return current;
  }

}

export default Collection;
