import { expect } from 'chai';
import createPipeline from '../../lib/pipeline/createPipeline';
import testConfig from '../../docs/config/tests.json';
import '../../config';

describe('Pipeline', function() {
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
      expect(pipeline.getReduction('articles')).to.exist;
      expect(pipeline.getReduction('connections')).to.exist;
      expect(pipeline.getReduction('platforms')).to.exist;
      expect(pipeline.getReduction('quickstarts')).to.exist;
      expect(pipeline.getReduction('snippets')).to.exist;
      done();
    });
  });

  describe('Compiled document metadata', () => {
    it('should contain a valid title if the document is public', (done) => {
      pipeline.whenReady(() => {
        pipeline.forEach(doc => {
          if (doc.public) {
            const message = `The document at ${doc.shortname} has an invalid title '${doc.title}'`;
            expect(doc.title).to.be.a('string', message);
            expect(doc.title).not.to.equal('Document', message);
          }
        });
        done();
      });
    });
  });

  describe('Compiled document content', () => {
    it('should not contain raw markdown characters', (done) => {
      pipeline.whenReady(() => {
        pipeline.forEach(doc => {
          const content = doc.getContent();
          const message = `The document at ${doc.shortname} contains invalid Markdown characters.`;
          expect(content).not.to.contain('```', message);
          expect(content).not.to.contain('###', message);
          expect(content).not.to.contain('![](', message);
        });
        done();
      });
    });
    it('should not reference blacklisted urls', (done) => {
      const urls = testConfig.blacklisted_urls;
      pipeline.whenReady(() => {
        pipeline.forEach(doc => {
          const content = doc.getContent();
          urls.forEach(url => {
            const message = `The document at ${doc.shortname} references a blacklisted URL: ${url}`;
            expect(content).not.to.contain(`href="${url}`, message);
            expect(content).not.to.contain(`src="${url}`, message);
          });
        });
        done();
      });
    });
  });

});
