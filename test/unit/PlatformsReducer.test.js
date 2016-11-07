import { resolve } from 'path';
import { expect } from 'chai';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import PlatformsReducer from '../../lib/pipeline/reducers/PlatformsReducer';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('PlatformsReducer', () => {

  const baseUrl = 'https://tests.local/';
  const mediaUrl = 'https://cdn.cloud/';
  const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });

  const articlesDir = resolve(__dirname, '../docs/articles');
  const appTypes = [
    { title: 'Example', name: 'example', slug: 'example-quickstarts', flavor: 'vanilla' }
  ];

  describe('when the constructor is called', () => {
    describe('without an appTypes option', () => {
      it('throws an Error', () => {
        const func = () => new PlatformsReducer({ articlesDir, urlFormatter });
        expect(func).to.throw(/requires an appTypes option/);
      });
    });
    describe('without an articlesDir option', () => {
      it('throws an Error', () => {
        const func = () => new PlatformsReducer({ appTypes, urlFormatter });
        expect(func).to.throw(/requires an articlesDir option/);
      });
    });
    describe('without a urlFormatter option', () => {
      it('throws an Error', () => {
        const func = () => new PlatformsReducer({ appTypes, articlesDir });
        expect(func).to.throw(/requires a urlFormatter option/);
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
      const reducer = new PlatformsReducer({ appTypes, articlesDir, urlFormatter });
      result = reducer.reduce(cache);
    });

    it('returns an array of platforms', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length(2);
    });

    it('creates platform entries using metadata read from index files', () => {
      const [platformA, platformB] = result;
      expect(platformA.name).to.equal('Platform A');
      expect(platformA.hash).to.equal('platform-a');
      expect(platformB.name).to.equal('Platform B');
      expect(platformB.hash).to.equal('platform-b');
    });

    it('sets the platform_type using the appType name', () => {
      const [platformA, platformB] = result;
      expect(platformA.platform_type).to.equal('example');
      expect(platformB.platform_type).to.equal('example');
    });

    it('formats platform URLs using the UrlFormatter', () => {
      const [platformA, platformB] = result;
      expect(platformA.url).to.equal(urlFormatter.format('/docs/quickstart/example/platform-a'));
      expect(platformB.url).to.equal(urlFormatter.format('/docs/quickstart/example/platform-b'));
    });

    it('formats platform image URLs using the UrlFormatter', () => {
      const [platformA, platformB] = result;
      expect(platformA.image).to.equal(urlFormatter.format('/media/platforms/platform-a.png'));
      expect(platformB.image).to.equal(urlFormatter.format('/media/platforms/platform-b.png'));
    });
  });

});
