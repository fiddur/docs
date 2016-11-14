import { expect } from 'chai';
import { createProductionPipeline } from '../util';
import Tree from '../../lib/pipeline/models/Tree';

describe('Articles Reduction', function() {
  this.timeout(30000);

  let cache;
  let reduction;

  const getExpectedMergePath = (doc) => (
    doc.shortname
    .replace(/^articles/, '')
    .replace(doc.extension, '')
    .replace(/\/index$/, '')
  );

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      reduction = pipeline.getReduction('articles');
      done();
    });
  });

  it('reduces to a tree', () => {
    expect(reduction).to.be.an.instanceof(Tree);
  });

  it('inserts metadata for each document into the correct location in the tree', () => {
    cache.forEach(doc => {
      const path = getExpectedMergePath(doc);
      const meta = doc.getMetadata();
      const entry = reduction.get(path);
      expect(entry).to.be.an('object');
      Object.keys(meta).forEach(key => {
        expect(entry[key]).to.deep.equal(meta[key]);
      });
    });
  });

});
