import { resolve } from 'path';
import { expect } from 'chai';
import { getTestDocument, getTestFile } from '../util';
import FakeCache from '../mocks/FakeCache';
import Tree from '../../lib/pipeline/models/Tree';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import ArticlesReducer from '../../lib/pipeline/reducers/ArticlesReducer';

describe('ArticlesReducer', () => {

  const docs = [
    getTestDocument(getTestFile('articles/connections/database/mysql.md')),
    getTestDocument(getTestFile('articles/connections/social/facebook.md')),
    getTestDocument(getTestFile('articles/quickstart/example-apptype/platform-a/01-example.md')),
    getTestDocument(getTestFile('articles/quickstart/example-apptype/platform-b/00-intro.md'))
  ];

  describe('when reduce() is called', () => {
    let result;

    before(() => {
      const cache = new FakeCache();
      docs.forEach(doc => cache.add(doc));
      const reducer = new ArticlesReducer();
      result = reducer.reduce(cache);
    });

    it('returns a Tree representing the articles', () => {
      expect(result).to.be.an.instanceof(Tree);
      const connections = result.get('connections');
      expect(connections).to.exist;
      expect(connections.hash).to.equal('connections');
      expect(connections.items).to.be.an('array');
      expect(connections.items).to.have.length(2);
      const quickstarts = result.get('example-quickstarts');
      expect(quickstarts).to.exist;
      expect(quickstarts.hash).to.equal('example-quickstarts');
      expect(quickstarts.items).to.be.an('array');
      expect(quickstarts.items).to.have.length(2);
    });

    it('inserts document metadata into the tree at the leaf nodes', () => {
      const item = result.get('connections/database/mysql');
      expect(item).to.exist;
      expect(item.title).to.equal('MySQL Connection');
      expect(item.connection).to.equal('MySQL');
      expect(item.image).to.equal('/media/connections/mysql.svg');
      expect(item.url).to.equal('/connections/database/mysql');
      expect(item.seo_alias).to.equal('mysql');
      expect(item.description).to.equal('How to authenticate users with username and password using a Custom Database.');
    });

  });

});
