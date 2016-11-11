import { expect } from 'chai';
import { basename, resolve } from 'path';
import FlagsPlugin from '../../lib/pipeline/plugins/metadata/FlagsPlugin';

describe('FlagsPlugin', () => {

  const plugin = new FlagsPlugin();

  describe('when getMetadata() is called', () => {
    const filename = resolve(__dirname, '..', 'docs/articles/test-markdown.md');
    describe('with public and sitemap not set in metadata', () => {
      const doc = { filename };
      const meta = plugin.getMetadata(doc, '');
      it('sets public to true', () => expect(meta.public).to.equal(true));
      it('sets sitemap to true', () => expect(meta.sitemap).to.equal(true));
    });
    describe('with public set to false', () => {
      const doc = { filename, public: false };
      const meta = plugin.getMetadata(doc, '');
      it('sets public to false', () => expect(meta.public).to.equal(false));
    });
    describe('with public set to a falsy value', () => {
      const doc = { filename, public: 0 };
      const meta = plugin.getMetadata(doc, '');
      it('sets public to true', () => expect(meta.public).to.equal(true));
    });
    describe('with sitemap set to false', () => {
      const doc = { filename, sitemap: false };
      const meta = plugin.getMetadata(doc, '');
      it('sets sitemap to false', () => expect(meta.sitemap).to.equal(false));
    });
    describe('with sitemap set to a falsy value', () => {
      const doc = { filename, sitemap: 0 };
      const meta = plugin.getMetadata(doc, '');
      it('sets sitemap to true', () => expect(meta.sitemap).to.equal(true));
    });
  });

});