import { resolve } from 'path';
import { expect } from 'chai';
import getTestDocument from './util/getTestDocument';
import getTestFile from './util/getTestFile';
import FakeCache from './mocks/FakeCache';
import PlatformsReducer from '../../lib/pipeline/reducers/PlatformsReducer';

describe('PlatformsReducer', () => {

  const articlesDir = resolve(__dirname, 'docs/articles');
  const appTypes = [
    { title: 'Example', name: 'example', slug: 'example-quickstarts' }
  ];

  describe('when the constructor is called', () => {
    describe('without an appTypes option', () => {
      it('throws an Error', () => {
        const func = () => new PlatformsReducer({ articlesDir });
        expect(func).to.throw(/requires an appTypes option/);
      });
    });
    describe('without an articlesDir option', () => {
      it('throws an Error', () => {
        const func = () => new PlatformsReducer({ appTypes });
        expect(func).to.throw(/requires an articlesDir option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;
    const doc1 = getTestDocument(getTestFile('articles/example-quickstarts/platform-a/01-example.md'));
    const doc2 = getTestDocument(getTestFile('articles/example-quickstarts/platform-b/00-intro.md'));

    before(() => {
      const cache = new FakeCache();
      cache.add(doc1);
      cache.add(doc2);
      const reducer = new PlatformsReducer({ appTypes, articlesDir });
      result = reducer.reduce(cache);
    });

    it('returns an object a key for each app type', () => {
      expect(Object.keys(result)).to.deep.equal(['example']);
    });

    it('builds a list of platforms for each app type', () => {
      expect(result.example).to.be.an('array');
      expect(result.example).to.have.length(2);
    });

    it('sets basic information on each platform', () => {
      const platform = result.example[0];
      expect(platform.name).to.equal('platform-a');
      expect(platform.type).to.equal('example');
      expect(platform.url).to.equal('/docs/quickstart/example/platform-a');
    });

    it('merges metadata from index files into the platforms', () => {
      const platform = result.example[0];
      expect(platform.foo).to.equal(42);
      expect(platform.bar).to.equal(123);
    });

    it('adds a list of articles to each platform', () => {
      const [platformA, platformB] = result.example;
      expect(platformA.articles).to.be.an('array');
      expect(platformA.articles).to.have.length(1);
      expect(platformB.articles).to.be.an('array');
      expect(platformB.articles).to.have.length(1);
    });

    it('sets basic information on each article', () => {
      const platform = result.example[0];
      const article = platform.articles[0];
      expect(article.name).to.equal('01-example');
      expect(article.number).to.equal(1);
      expect(article.url).to.equal('/docs/quickstart/example/platform-a/01-example');
    });

    it('merges metadata from corresponding documents into the articles', () => {
      const platform = result.example[0];
      const article = platform.articles[0];
      expect(article.title).to.equal(doc1.meta.title);
      expect(article.description).to.equal(doc1.meta.description);
      expect(article.budicon).to.equal(doc1.meta.budicon);
    });

    it('sets a default article for the platform if one is specified in the index file', () => {
      const [platformA, platformB] = result.example;
      expect(platformA.defaultArticle).to.exist;
      expect(platformA.defaultArticle.name).to.equal('01-example');
      expect(platformB.defaultArticle).to.not.exist;
    });

  });

});
