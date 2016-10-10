import { expect } from 'chai';
import AutoSectionPlugin from '../../lib/pipeline/plugins/metadata/AutoSectionPlugin';

describe('AutoSectionPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with section already set in metadata', () => {
      it('does not return a new section', () => {
        const plugin = new AutoSectionPlugin();
        const meta = plugin.getMetadata({ section: 'api' }, '');
        expect(meta).to.equal(null);
      });
    });

    describe('with section not set in metadata', () => {
      it('returns a default section', () => {
        const plugin = new AutoSectionPlugin();
        const meta = plugin.getMetadata({}, '');
        expect(meta).to.deep.equal({ section: AutoSectionPlugin.defaults.section });
      });
      it('allows overriding of the default section', () => {
        const section = 'test-example';
        const plugin = new AutoSectionPlugin({ section });
        const meta = plugin.getMetadata({}, '');
        expect(meta).to.deep.equal({ section });
      });
    });

  });

});
