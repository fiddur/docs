import { basename, extname } from 'path';
import { expect } from 'chai';
import matter from 'gray-matter';
import _ from 'lodash';
import createRenderer from '../../lib/pipeline/createRenderer';
import FakeCache from './mocks/FakeCache';
import getTestFile from './util/getTestFile';
import getTestDocument from './util/getTestDocument';

describe('createRenderer', () => {

  const vars = { environment: 'test' };
  let cache;

  beforeEach(() => {
    cache = new FakeCache();
  });

  describe('when called with a Document with a call to cache.get()', () => {
    const file = getTestFile('articles/cache-get.html');
    const doc1 = getTestDocument(getTestFile('articles/test-markdown.md'));
    const doc2 = getTestDocument(file);
    it('gets the requested doc from the cache', () => {
      cache.add(doc1);
      const template = _.template(file.text);
      const renderer = createRenderer(template, doc2, cache, vars);
      const content = renderer();
      expect(content).to.equal('The path of the cached document is articles/test-markdown');
    });
    it('adds the returned doc as a dependency', () => {
      cache.add(doc1);
      const template = _.template(file.text);
      const renderer = createRenderer(template, doc2, cache, vars);
      const content = renderer();
      expect(doc2.hasDependency(doc1.filename)).to.be.true;
    });
  });

  describe('when called with a Document with a call to cache.find()', () => {
    const file = getTestFile('articles/cache-find.html');
    const doc1 = getTestDocument(getTestFile('articles/test-markdown.md'));
    const doc2 = getTestDocument(getTestFile('articles/test-html.html'));
    const doc3 = getTestDocument(file);
    it('gets the requested docs from the cache', () => {
      cache.add(doc1);
      cache.add(doc2);
      const template = _.template(file.text);
      const renderer = createRenderer(template, doc3, cache, vars);
      const content = renderer();
      expect(content).to.equal('The path of the cached documents are:\n\narticles/test-markdown\n\narticles/test-html\n');
    });
    it('adds the returned docs as dependencies', () => {
      cache.add(doc1);
      cache.add(doc2);
      const template = _.template(file.text);
      const renderer = createRenderer(template, doc3, cache, vars);
      const content = renderer();
      expect(doc3.hasDependency(doc1.filename)).to.be.true;
      expect(doc3.hasDependency(doc2.filename)).to.be.true;
    });
  });

});
