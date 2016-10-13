import { expect } from 'chai';
import AutoUrlPlugin from '../../lib/pipeline/plugins/metadata/AutoUrlPlugin';

describe('AutoUrlPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with url already set on document', () => {
      it('does not return a new url', () => {
        const plugin = new AutoUrlPlugin();
        const meta = plugin.getMetadata({ url: '/articles/test-example' }, '');
        expect(meta).to.equal(null);
      });
    });

    describe('with url not set on document', () => {
      it('returns a url using the path', () => {
        const path = '/articles/test-example';
        const plugin = new AutoUrlPlugin();
        const meta = plugin.getMetadata({ path }, '');
        expect(meta).to.deep.equal({ url: path });
      });
      it('makes "index" files have the url of the parent directory', () => {
        const path = '/articles/example/index';
        const plugin = new AutoUrlPlugin();
        const meta = plugin.getMetadata({ path }, '');
        expect(meta).to.deep.equal({ url: '/articles/example' });
      });
    });

  });

});
