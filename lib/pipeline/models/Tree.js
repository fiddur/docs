import { compact, find, merge, omit } from 'lodash';

/**
 * A model for a tree-like structure that resembles this:
 *
 * {
 *   hash: 'parent'
 *   items: [
 *     { hash: 'child1', items: [...], ...properties },
 *     { hash: 'child2', items: [...] }
 *   ]
 * }
 */
class Tree {

  /**
   * Creates an instance of Tree.
   */
  constructor() {
    this.value = { hash: '/', items: [] };
  }

  /**
   * Adds the data in the specified object at the specified path in the tree.
   * The path should be a series of tokens separated by forward slashes. If
   * the path ends with the special word "index", the data from obj will be
   * merged into the previous node; otherwise, a new leaf node will be created
   * using the properties of obj.
   * @param {String} path - The path at which to insert the data.
   * @param {Object} obj - The data to insert.
   */
  add(path, obj) {
    const tokens = compact(path.split('/'));
    const hash = tokens.pop();

    let current = this.value;
    tokens.forEach(token => {
      let next = find(current.items, { hash: token });
      if (!next) {
        next = { hash: token, items: [] };
        if (!current.items) current.items = [];
        current.items.push(next);
      }
      current = next;
    });

    if (hash === 'index') {
      merge(current, obj);
    } else {
      const value = merge({ hash }, obj);
      if (!current.items) current.items = [];
      current.items.push(value);
    }
  }

  /**
   * Returns the data at the specified path. The path should be a series of
   * tokens separated by forward slashes. If the Tree doesn't contain the
   * necessary branches described by the path, an Error will be thrown.
   * @param {String} path - The path into the tree to retrieve.
   * @returns {Object} The value at the specified position in the tree.
   */
  get(path) {
    if (!path) {
      throw new Error('Error walking tree: path was null');
    }

    const tokens = compact(path.split('/'));

    let current = this.value;
    tokens.forEach(token => {
      if (token) {
        current = find(current.items, { hash: token });
      }
      if (!current) {
        throw new Error(`Error walking tree: couldn't find a branch for ${token} in path ${path}`);
      }
    });

    return current;
  }

  /**
   * Returns the value of the Tree.
   * @returns {Object} An object representing the data contained in the tree.
   */
  valueOf() {
    return this.value;
  }

  /**
   * Returns a serializable version of the Tree.
   * @returns {Object} A serializable object representing the data contained in the tree.
   */
  toJSON() {
    return this.valueOf();
  }

}

export default Tree;
