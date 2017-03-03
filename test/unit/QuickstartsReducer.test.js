import { resolve } from 'path';
import { expect } from 'chai';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import QuickstartsReducer from '../../lib/pipeline/reducers/QuickstartsReducer';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('QuickstartsReducer', () => {

  const baseUrl = 'https://tests.local/docs';
  const mediaUrl = 'https://cdn.cloud/';
  const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });

  const articlesDir = resolve(__dirname, '../docs/articles');
  const appTypes = [
    { title: 'Example', name: 'example-apptype', slug: 'example-apptype', flavor: 'vanilla' }
  ];

  describe('when the constructor is called', () => {
    describe('without an appTypes option', () => {
      it('throws an Error', () => {
        const func = () => new QuickstartsReducer({ articlesDir, urlFormatter });
        expect(func).to.throw(/requires an appTypes option/);
      });
    });
    describe('without an articlesDir option', () => {
      it('throws an Error', () => {
        const func = () => new QuickstartsReducer({ appTypes, urlFormatter });
        expect(func).to.throw(/requires an articlesDir option/);
      });
    });
    describe('without an urlFormatter option', () => {
      it('throws an Error', () => {
        const func = () => new QuickstartsReducer({ appTypes, articlesDir });
        expect(func).to.throw(/requires a urlFormatter option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;
    const doc1 = getTestDocument(getTestFile('articles/quickstart/example-apptype/platform-a/01-example.md'));
    const doc2 = getTestDocument(getTestFile('articles/quickstart/example-apptype/platform-b/00-intro.md'));

    before(() => {
      const cache = new FakeCache();
      cache.add(doc1);
      cache.add(doc2);
      const reducer = new QuickstartsReducer({ appTypes, articlesDir, urlFormatter });
      result = reducer.reduce(cache);
    });

    it('returns an object a key for each app type', () => {
      expect(Object.keys(result)).to.deep.equal(['example']);
    });

    it('merges the metadata in from the app type', () => {
      const appType = appTypes[0];
      expect(result.example.name).to.equal(appType.name);
      expect(result.example.title).to.equal(appType.title);
      expect(result.example.slug).to.equal(appType.slug);
      expect(result.example.flavor).to.equal(appType.flavor);
    });

    it('builds a hash of platforms for each app type', () => {
      const { platforms } = result.example;
      expect(platforms).to.be.an('object');
      expect(platforms).to.have.keys(['platform-a', 'platform-b']);
    });

    it('sets basic information on each platform', () => {
      const platform = result.example.platforms['platform-a'];
      expect(platform.name).to.equal('platform-a');
      expect(platform.title).to.equal('Platform A');
      expect(platform.url).to.equal('/docs/quickstart/example/platform-a');
      expect(platform.image).to.equal(urlFormatter.format('/media/platforms/platform-a.png'));
    });

    it('adds a list of articles to each platform', () => {
      const platformA = result.example.platforms['platform-a'];
      const platformB = result.example.platforms['platform-b'];
      expect(platformA.articles).to.be.an('array');
      expect(platformA.articles).to.have.length(1);
      expect(platformB.articles).to.be.an('array');
      expect(platformB.articles).to.have.length(1);
    });

    it('sets basic information on each article', () => {
      const article = result.example.platforms['platform-a'].articles[0];
      expect(article.name).to.equal('01-example');
      expect(article.number).to.equal(1);
      expect(article.url).to.equal('/docs/quickstart/example/platform-a/01-example');
    });

    it('merges metadata from corresponding documents into the articles', () => {
      const article = result.example.platforms['platform-a'].articles[0];
      expect(article.title).to.equal(doc1.title);
      expect(article.description).to.equal(doc1.description);
      expect(article.budicon).to.equal(doc1.budicon);
    });

    it('sets a default article for the platform if one is specified in the index file', () => {
      const platformA = result.example.platforms['platform-a'];
      const platformB = result.example.platforms['platform-b'];
      expect(platformA.defaultArticle).to.exist;
      expect(platformA.defaultArticle.name).to.equal('01-example');
      expect(platformB.defaultArticle).to.not.exist;
    });

  });

});
