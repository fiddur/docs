import { expect } from 'chai';
import { resolve } from 'path';
import lsr from 'lsr';
import FakeCache from '../mocks/FakeCache';
import UpdatesReducer from '../../lib/pipeline/reducers/UpdatesReducer';

describe('Updates Reduction', () => {

  const updatesDir = resolve(__dirname, '../../docs/updates');
  const files = lsr.sync(updatesDir);

  let reduction;

  before(() => {
    const cache = new FakeCache();
    const reducer = new UpdatesReducer({ updatesDir });
    reduction = reducer.reduce(cache);
  });

  it('reduces to an array', () => {
    expect(reduction).to.be.an('array');
    expect(reduction).to.have.length(files.length);
  });

  it('adds an item for each update', () => {
    reduction.forEach(update => {
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
