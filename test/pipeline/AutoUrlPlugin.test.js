import { expect } from 'chai';
import AutoUrlPlugin from '../../lib/pipeline/plugins/metadata/AutoUrlPlugin';

describe('AutoUrlPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with url already set on document', () => {
      it('does not return a new url', () => {
        const plugin = new AutoUrlPlugin();
        const doc = { meta: { url: '/articles/test-example' } };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

    describe('with url not set on document', () => {
      it('returns a url using the path', () => {
        const plugin = new AutoUrlPlugin();
        const doc = { path: '/articles/test-example', meta: {} };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ url: doc.path });
      });
      it('makes "index" files have the url of the parent directory', () => {
        const doc = { path: '/articles/example/index', meta: {} };
        const plugin = new AutoUrlPlugin();
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ url: '/articles/example' });
      });
    });

  });

});
