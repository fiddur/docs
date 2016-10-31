import { expect } from 'chai';
import AutoSectionPlugin from '../../lib/pipeline/plugins/metadata/AutoSectionPlugin';

describe('AutoSectionPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with section already set on document', () => {
      it('does not return a new section', () => {
        const plugin = new AutoSectionPlugin();
        const doc = { meta: { section: 'api' } };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

    describe('with section not set on document', () => {
      it('returns a default section', () => {
        const plugin = new AutoSectionPlugin();
        const doc = { meta: {} };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ section: AutoSectionPlugin.defaults.section });
      });
      it('allows overriding of the default section', () => {
        const section = 'test-example';
        const plugin = new AutoSectionPlugin({ section });
        const doc = { meta: {} };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ section });
      });
    });

  });

});
