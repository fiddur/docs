import { resolve } from 'path';
import { expect } from 'chai';
import SnippetsReducer from '../../lib/pipeline/reducers/SnippetsReducer';
import Tree from '../../lib/pipeline/models/Tree';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('SnippetsReducer', () => {

  const snippetsDir = resolve(__dirname, '../docs/snippets');

  describe('when the constructor is called', () => {
    describe('without a snippetsDir option', () => {
      it('throws an Error', () => {
        const func = () => new SnippetsReducer({});
        expect(func).to.throw(/requires a snippetsDir option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;

    before(() => {
      const cache = new FakeCache();
      const reducer = new SnippetsReducer({ snippetsDir });
      result = reducer.reduce(cache);
    });

    it('returns a Tree representing the snippets', () => {
      expect(result).to.be.an.instanceof(Tree);
      const foo = result.get('foo');
      expect(foo).to.exist;
      expect(foo.hash).to.equal('foo');
      expect(foo.items).to.be.an('array');
      expect(foo.items).to.have.length(1);
      const bar = result.get('bar');
      expect(bar).to.exist;
      expect(bar.hash).to.equal('bar');
      expect(bar.items).to.be.an('array');
      expect(bar.items).to.have.length(1);
    });

    it('transforms the Markdown content of each snippet', () => {
      const foo = result.get('foo/snippet-foo');
      expect(foo).to.exist;
      expect(foo.hash).to.equal('snippet-foo');
      expect(foo.content).to.equal('<p>Snippet: foo = ${meta.foo}, bar = ${meta.bar}</p>\n');
      const bar = result.get('bar/snippet-bar');
      expect(bar).to.exist;
      expect(bar.hash).to.equal('snippet-bar');
      expect(bar.content).to.equal('<p>This is an example snippet with metadata.</p>\n');
    });

    it('merges metadata from snippet front matter into the entries', () => {
      const bar = result.get('bar/snippet-bar');
      expect(bar).to.exist;
      expect(bar.title).to.equal('Bar');
    });

    it('does not add items arrays to leaf nodes of the tree', () => {
      const foo = result.get('bar/snippet-bar');
      expect(foo).to.exist;
      expect(foo.items).to.not.exist;
    });

  });

});
