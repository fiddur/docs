import { expect } from 'chai';
import { basename, dirname } from 'path';
import { createProductionPipeline } from '../util';

describe('Connections Reduction', function() {
  this.timeout(30000);

  let cache;
  let urlFormatter;
  let reduction;

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      urlFormatter = pipeline.urlFormatter;
      reduction = pipeline.getReduction('connections');
      done();
    });
  });

  it('reduces to an array', () => {
    expect(reduction).to.be.an('array');
    expect(reduction).to.have.length.above(0);
  });

  it('adds an entry for each connection article', () => {
    const docs = cache.find('articles/connections').filter(doc => doc.connection);
    expect(reduction).to.have.length(docs.length);
    docs.forEach(doc => {
      const entry = reduction.find(item => item.hash === doc.hash);
      expect(entry).to.be.an('object');
      expect(entry.title).to.equal(doc.connection);
      expect(entry.url).to.equal(urlFormatter.format(doc.url));
      expect(entry.image).to.equal(urlFormatter.format(doc.image));
      expect(entry.type).to.equal(basename(dirname(doc.filename)));
      expect(entry.alias).to.equal(doc.alias);
      expect(entry.seo_alias).to.equal(doc.seo_alias);
    });
  });

});
