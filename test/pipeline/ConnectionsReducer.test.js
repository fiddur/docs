import { resolve } from 'path';
import { expect } from 'chai';
import getTestDocument from './util/getTestDocument';
import getTestFile from './util/getTestFile';
import FakeCache from './mocks/FakeCache';
import ConnectionsReducer from '../../lib/pipeline/reducers/ConnectionsReducer';

describe('ConnectionsReducer', () => {

  describe('when reduce() is called', () => {
    let result;
    const doc1 = getTestDocument(getTestFile('articles/connections/database/mysql.md'));
    const doc2 = getTestDocument(getTestFile('articles/connections/social/facebook.md'));

    before(() => {
      const cache = new FakeCache();
      cache.add(doc1);
      cache.add(doc2);
      const reducer = new ConnectionsReducer();
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
        expect(entry.title).to.equal(doc.meta.connection);
        expect(entry.hash).to.equal(doc.hash);
        expect(entry.url).to.equal(doc.meta.url);
        expect(entry.image).to.equal(doc.meta.image);
        expect(entry.alias).to.equal(doc.meta.alias);
        expect(entry.seo_alias).to.equal(doc.meta.seo_alias);
      });
    });

    it('add a type property to each entity based on the directory in which it exists', () => {
      const [entry1, entry2] = result;
      expect(entry1.type).to.equal('database');
      expect(entry2.type).to.equal('social');
    });

  });

});
