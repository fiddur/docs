import { expect } from 'chai';
import Tree from '../../lib/pipeline/models/Tree';

describe('Tree', () => {

  /*
  tree.value = {
    hash: '/',
    items: [{
      hash: 'foo',
      items: [{ hash: 'bar', name: 'example' }]
    }]
  }
  */

  const bar = { hash: 'bar', name: 'example' };
  const foo = { hash: 'foo', items: [bar] };
  const root = { hash: '/', items: [foo] };

  let tree;

  beforeEach(() => {
    tree = new Tree();
  });

  describe('when add() is called', () => {
    it('adds the value in the correct location', () => {
      tree.add('foo/bar', { name: 'example' });
      expect(tree.valueOf()).to.deep.equal(root);
    });
  });

  describe('when get() is called', () => {

    beforeEach(() => {
      tree.add('foo/bar', { name: 'example' });
    });

    describe('with a falsy path', () => {
      it('throws an Error', () => {
        const func = () => tree.get(null);
        expect(func).to.throw(/path was null/);
      });
    });

    describe('with an invalid path', () => {
      it('throws an Error', () => {
        const func = () => tree.get('foo/does-not-exist');
        expect(func).to.throw(/couldn't find a branch for does-not-exist/);
      });
    });

    describe('with the root path', () => {
      it('returns the root value', () => {
        const result = tree.get('/');
        expect(result).to.deep.equal(root);
      });
    });

    describe('with a branch path', () => {
      it('returns the branch value', () => {
        const result = tree.get('foo');
        expect(result).to.deep.equal(foo);
      });
    });

    describe('with a leaf path', () => {
      it('returns the leaf value', () => {
        const result = tree.get('foo/bar');
        expect(result).to.deep.equal(bar);
      });
    });

  });

});
