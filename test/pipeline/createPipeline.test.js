import { expect } from 'chai';
import createPipeline from '../../lib/pipeline/createPipeline';
import '../../config';

describe('createPipeline', function() {
  this.timeout(30000);
  let pipeline;
  before(() => {
    pipeline = createPipeline();
  });

  it('adds documents to the cache', (done) => {
    pipeline.whenReady(() => {
      const stats = pipeline.getStats();
      expect(stats.count).to.be.above(0);
      done();
    });
  });

  it('registers reductions', (done) => {
    pipeline.whenReady(() => {
      expect(pipeline.getReduction('connections')).to.exist;
      expect(pipeline.getReduction('platforms')).to.exist;
      expect(pipeline.getReduction('quickstarts')).to.exist;
      done();
    });
  });

});
