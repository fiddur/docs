import { expect } from 'chai';
import { createProductionPipeline } from '../util';
import testConfig from '../../docs/config/tests.json';

describe('Pipeline', function() {
  this.timeout(30000);

  let cache;

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      done();
    });
  });

  it('adds documents to the cache', () => {
    const stats = cache.getStats();
    expect(stats.count).to.be.above(0);
  });

  it('registers reductions', () => {
    expect(cache.getReduction('articles')).to.exist;
    expect(cache.getReduction('connections')).to.exist;
    expect(cache.getReduction('platforms')).to.exist;
    expect(cache.getReduction('quickstarts')).to.exist;
    expect(cache.getReduction('platforms')).to.exist;
    expect(cache.getReduction('snippets')).to.exist;
  });

  describe('Compiled document metadata', () => {
    it('should contain a valid title if the document is public', () => {
      cache.forEach(doc => {
        if (doc.public) {
          const message = `The document at ${doc.shortname} has an invalid title '${doc.title}'`;
          expect(doc.title).to.be.a('string', message);
          expect(doc.title).not.to.equal('Document', message);
        }
      });
    });
  });

  describe('Compiled document content', () => {
    it('should not contain raw markdown characters', () => {
      cache.forEach(doc => {
        const content = doc.getContent();
        const message = `The document at ${doc.shortname} contains invalid Markdown characters.`;
        expect(content).not.to.contain('```', message);
        expect(content).not.to.contain('###', message);
        expect(content).not.to.contain('![](', message);
      });
    });
    it('should not reference blacklisted urls', () => {
      const urls = testConfig.blacklisted_urls;
      cache.forEach(doc => {
        const content = doc.getContent();
        urls.forEach(url => {
          const message = `The document at ${doc.shortname} references a blacklisted URL: ${url}`;
          expect(content).not.to.contain(`href="${url}`, message);
          expect(content).not.to.contain(`src="${url}`, message);
        });
      });
    });
  });

});
