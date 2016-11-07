import { expect } from 'chai';
import AutoUrlPlugin from '../../lib/pipeline/plugins/metadata/AutoUrlPlugin';

describe('AutoUrlPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with url already set on document', () => {
      it('does not return a new url', () => {
        const plugin = new AutoUrlPlugin();
        const doc = { url: '/articles/test-example' };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

    describe('with url not set on document', () => {
      it('returns a url using the path', () => {
        const plugin = new AutoUrlPlugin();
        const doc = { path: '/articles/test-example' };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ url: doc.path });
      });
    });

  });

});
