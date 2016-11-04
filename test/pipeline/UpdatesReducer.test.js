import { resolve } from 'path';
import { expect } from 'chai';
import FakeCache from './mocks/FakeCache';
import UpdatesReducer from '../../lib/pipeline/reducers/UpdatesReducer';

describe('UpdatesReducer', () => {

  const updatesDir = resolve(__dirname, 'docs/updates');

  describe('when the constructor is called', () => {
    describe('without an updatesDir option', () => {
      it('throws an Error', () => {
        const func = () => new UpdatesReducer({});
        expect(func).to.throw(/requires an updatesDir option/);
      });
    });
  });

  describe('when reduce() is called', () => {
    let result;

    before(() => {
      const cache = new FakeCache();
      const reducer = new UpdatesReducer({ updatesDir });
      result = reducer.reduce(cache);
    });

    it('returns an array of updates with one entry per file', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length(2);
    });

    it('sets dates of each entry to match the filename', () => {
      expect(result[0].date).to.eql(new Date('2016-11-03'));
      expect(result[1].date).to.eql(new Date('2016-11-04'));
    });

    it('sets the title of each entry to the filename without the extension', () => {
      expect(result[0].title).to.equal('2016-11-03');
      expect(result[1].title).to.equal('2016-11-04');
    });

    it('correctly processes adds', () => {
      const adds = result[0].added;
      expect(adds).to.be.an('array');
      expect(adds).to.have.length(1);
      expect(adds[0].title).to.equal('add-example');
      expect(adds[0].description).to.equal('<p>This is an <em>example</em> add</p>\n');
    });

    it('correctly processes fixes', () => {
      const fixes = result[0].fixed;
      expect(fixes).to.be.an('array');
      expect(fixes).to.have.length(2);
      expect(fixes[0].title).to.equal('fix-example-1');
      expect(fixes[0].description).to.equal('<p>This is an <em>example</em> fix</p>\n');
      expect(fixes[1].title).to.equal('fix-example-2');
      expect(fixes[1].description).to.equal('<p>This is another <em>example</em> fix</p>\n');
    });

    it('correctly processes changes', () => {
      const changes = result[1].changed;
      expect(changes).to.be.an('array');
      expect(changes).to.have.length(2);
      expect(changes[0].title).to.equal('change-example-1');
      expect(changes[0].description).to.equal('<p>This is an <em>example</em> change</p>\n');
      expect(changes[1].title).to.equal('change-example-2');
      expect(changes[1].description).to.equal('<p>This is another <em>example</em> change</p>\n');
    });

    it('merges metadata from the update entries into the tree', () => {
      const changes = result[1].changed;
      expect(changes).to.be.an('array');
      expect(changes).to.have.length(2);
      expect(changes[1].foo).to.equal(42);
      expect(changes[1].bar).to.equal(123);
    });

  });

});
