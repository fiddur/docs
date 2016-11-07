import { resolve } from 'path';
import { expect } from 'chai';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import ConnectionsReducer from '../../lib/pipeline/reducers/ConnectionsReducer';
import FakeCache from '../mocks/FakeCache';
import { getTestDocument, getTestFile } from '../util';

describe('ConnectionsReducer', () => {

  const baseUrl = 'https://tests.local/';
  const mediaUrl = 'https://cdn.cloud/';

  describe('when the constructor is called', () => {
    describe('without a urlFormatter option', () => {
      it('throws an Error', () => {
        const func = () => new ConnectionsReducer();
        expect(func).to.throw(/requires a urlFormatter option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;
    const doc1 = getTestDocument(getTestFile('articles/connections/database/mysql.md'));
    const doc2 = getTestDocument(getTestFile('articles/connections/social/facebook.md'));
    const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });

    before(() => {
      const cache = new FakeCache();
      cache.add(doc1);
      cache.add(doc2);
      const reducer = new ConnectionsReducer({ urlFormatter });
      result = reducer.reduce(cache);
    });

    it('returns an array of connections', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length(2);
    });

    it('creates connection entries from the metadata of documents', () => {
      const docs = [doc1, doc2];
      result.forEach((entry, index) => {
        const doc = docs[index];
        expect(entry.title).to.equal(doc.connection);
        expect(entry.hash).to.equal(doc.hash);
        expect(entry.alias).to.equal(doc.alias);
        expect(entry.seo_alias).to.equal(doc.seo_alias);
      });
    });

    it('formats URLs using the UrlFormatter', () => {
      const docs = [doc1, doc2];
      result.forEach((entry, index) => {
        const doc = docs[index];
        expect(entry.url).to.equal(urlFormatter.format(doc.url));
        expect(entry.image).to.equal(urlFormatter.format(doc.image));
      });
    });

    it('add a type property to each entity based on the directory in which it exists', () => {
      const [entry1, entry2] = result;
      expect(entry1.type).to.equal('database');
      expect(entry2.type).to.equal('social');
    });

  });

});
