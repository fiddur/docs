import { expect } from 'chai';
import AutoEditUrlPlugin from '../../lib/pipeline/plugins/metadata/AutoEditUrlPlugin';

describe('AutoEditUrlPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with editUrl already set on document', () => {
      it('does not return a new editUrl', () => {
        const plugin = new AutoEditUrlPlugin();
        const doc = { meta: { editUrl: 'http://example.com' } };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

    describe('with editUrl not set on document', () => {
      it('returns an editUrl using the baseUrl and the hash', () => {
        const plugin = new AutoEditUrlPlugin();
        const doc = { hash: 'example.md', meta: { } };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ editUrl: AutoEditUrlPlugin.defaults.baseUrl + doc.basename });
      });
      it('allows overriding of the baseUrl', () => {
        const baseUrl = 'http://different-site.com/';
        const plugin = new AutoEditUrlPlugin({ baseUrl });
        const doc = { hash: 'example.md', meta: {} };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ editUrl: baseUrl + doc.basename });
      });
    });

  });

});
