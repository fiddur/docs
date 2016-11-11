import { expect } from 'chai';
import { resolve } from 'path';
import FakeCache from '../mocks/FakeCache';
import UpdatesReducer from '../../lib/pipeline/reducers/UpdatesReducer';

describe('Updates', () => {

  const updatesDir = resolve(__dirname, '../../docs/updates');

  describe('when reduce() is called', () => {
    let result;

    before(() => {
      const cache = new FakeCache();
      const reducer = new UpdatesReducer({ updatesDir });
      result = reducer.reduce(cache);
    });

    it('are in a valid format', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length.above(0);
      result.forEach(update => {
        expect(update.title).to.be.a('string');
        expect(update.title).to.have.length.above(0);
        expect(update.date).to.be.an.instanceof(Date);
        expect(update.date).to.exist;
        if (update.items) {
          update.items.forEach(item => {
            expect(item.title).to.be.a('string');
            expect(item.title).to.have.length.above(0);
            expect(item.tags).to.be.an('array');
            expect(item.tags).to.have.length.above(0);
            expect(item.description).to.be.a('string');
            expect(item.description).to.have.length.above(0);
          });
        }
      });
    });

  });
});
