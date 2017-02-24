import { extname, resolve } from 'path';
import { expect } from 'chai';
import urljoin from 'url-join';
import { parseString as parseXmlString } from 'xml2js';
import SitemapReducer from '../../lib/pipeline/reducers/SitemapReducer';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('SitemapReducer', () => {

  const baseUrl = 'https://tests.local/docs';

  const articlesDir = resolve(__dirname, '../docs/articles');
  const appTypes = [
    { title: 'Example', name: 'example-apptype', slug: 'example-apptype', flavor: 'vanilla' }
  ];

  const docs = [
    'articles/connections/database/mysql.md',
    'articles/connections/social/facebook.md',
    'articles/quickstart/example-apptype/platform-a/01-example.md',
    'articles/quickstart/example-apptype/platform-b/00-intro.md'
  ].map(path => getTestDocument(getTestFile(path), {
    sitemap: true,
    public: true,
    url: urljoin(baseUrl, path.replace(/^articles/, '').replace(extname(path), ''))
  }));

  const expectedUrls = [
    '',
    '/quickstart/example-apptype',
    '/quickstart/example-apptype/platform-a',
    '/quickstart/example-apptype/platform-a/01-example',
    '/quickstart/example-apptype/platform-b',
    '/quickstart/example-apptype/platform-b/00-intro',
    '/connections/database/mysql',
    '/connections/social/facebook'
  ].map(url => urljoin(baseUrl, url));

  describe('when the constructor is called', () => {
    describe('without an appTypes option', () => {
      it('throws an Error', () => {
        const func = () => new SitemapReducer({ articlesDir, baseUrl });
        expect(func).to.throw(/requires an appTypes option/);
      });
    });
    describe('without an articlesDir option', () => {
      it('throws an Error', () => {
        const func = () => new SitemapReducer({ appTypes, baseUrl });
        expect(func).to.throw(/requires an articlesDir option/);
      });
    });
    describe('without a baseUrl option', () => {
      it('throws an Error', () => {
        const func = () => new SitemapReducer({ appTypes, articlesDir });
        expect(func).to.throw(/requires a baseUrl option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;

    before(() => {
      const cache = new FakeCache();
      docs.forEach(doc => cache.add(doc));
      const reducer = new SitemapReducer({ appTypes, articlesDir, baseUrl });
      result = reducer.reduce(cache);
    });

    it('returns an object with the expected structure', () => {
      expect(result).to.be.an('object');
      expect(result.urls).to.be.an('array');
      expect(result.urls).to.have.length(expectedUrls.length);
      expect(result.xml).to.be.a('string');
    });

    it('adds a url for each document and each quickstart article', () => {
      expect(result.urls).to.have.members(expectedUrls);
    });

    it('builds a well-formatted xml sitemap string', (done) => {
      parseXmlString(result.xml, (err, data) => {
        expect(err).not.to.exist;
        expect(data.urlset).to.exist;
        expect(data.urlset.url).to.be.an('array');
        expect(data.urlset.url).to.have.length(expectedUrls.length);
        data.urlset.url.forEach(item => {
          expect(item.loc).to.be.an('array');
          expect(item.loc).to.have.length(1);
          expect(item.loc[0]).to.be.oneOf(expectedUrls);
        });
        done();
      });
    });
  });

});
