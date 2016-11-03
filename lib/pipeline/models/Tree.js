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

  constructor() {
    this.value = { hash: '/', items: [] };
  }

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

  get(path) {
    if (!path) {
      throw new Error('Error walking tree: path was null');
    }

    let current = this.value;
    path.split('/').forEach(token => {
      if (token) {
        current = find(current.items, { hash: token });
      }
      if (!current) {
        throw new Error(`Error walking tree: couldn't find a branch for ${token} in path ${path}`);
      }
    });

    return current;
  }

  valueOf() {
    return this.value;
  }

  toJSON() {
    return this.valueOf();
  }

}

export default Tree;
