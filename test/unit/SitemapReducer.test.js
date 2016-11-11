import { resolve } from 'path';
import { expect } from 'chai';
import urljoin from 'url-join';
import { parseString as parseXmlString } from 'xml2js';
import SitemapReducer from '../../lib/pipeline/reducers/SitemapReducer';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('SitemapReducer', () => {

  const baseUrl = 'https://tests.local/';

  const articlesDir = resolve(__dirname, '../docs/articles');
  const appTypes = [
    { title: 'Example', name: 'example', slug: 'example-quickstarts', flavor: 'vanilla' }
  ];

  const docs = [
    getTestDocument(getTestFile('articles/connections/database/mysql.md'), { sitemap: true, url: '/connections/database/mysql' }),
    getTestDocument(getTestFile('articles/connections/social/facebook.md'), { sitemap: true, url: '/connections/social/facebook' }),
    getTestDocument(getTestFile('articles/example-quickstarts/platform-a/01-example.md'), { sitemap: true, url: '/example-quickstarts/platform-a/01-example' }),
    getTestDocument(getTestFile('articles/example-quickstarts/platform-b/00-intro.md'), { sitemap: true, url: '/example-quickstarts/platform-b/00-intro' })
  ];

  const expectedUrls = [
    '/docs',
    '/docs/quickstart/example',
    '/docs/quickstart/example/platform-a',
    '/docs/quickstart/example/platform-a/01-example',
    '/docs/quickstart/example/platform-b',
    '/docs/quickstart/example/platform-b/00-intro',
    '/docs/connections/database/mysql',
    '/docs/connections/social/facebook'
  ];

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
          const url = item.loc[0].replace(baseUrl, '/');
          expect(url).to.be.oneOf(expectedUrls);
        });
        done();
      });
    });
  });

});