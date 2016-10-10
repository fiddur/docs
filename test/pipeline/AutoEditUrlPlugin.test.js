import { expect } from 'chai';
import AutoEditUrlPlugin from '../../lib/pipeline/plugins/metadata/AutoEditUrlPlugin';

describe('AutoEditUrlPlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with editUrl already set in metadata', () => {
      it('does not return a new editUrl', () => {
        const plugin = new AutoEditUrlPlugin();
        const meta = plugin.getMetadata({ editUrl: 'http://example.com' }, '');
        expect(meta).to.equal(null);
      });
    });

    describe('with editUrl not set in metadata', () => {
      it('returns an editUrl using the baseUrl and the hash', () => {
        const plugin = new AutoEditUrlPlugin();
        const hash = 'example.md';
        const meta = plugin.getMetadata({ hash }, '');
        expect(meta).to.deep.equal({ editUrl: AutoEditUrlPlugin.defaults.baseUrl + hash });
      });
      it('allows overriding of the baseUrl', () => {
        const baseUrl = 'http://different-site.com/';
        const plugin = new AutoEditUrlPlugin({ baseUrl });
        const hash = 'example.md';
        const meta = plugin.getMetadata({ hash }, '');
        expect(meta).to.deep.equal({ editUrl: baseUrl + hash });
      });
    });

  });

});
