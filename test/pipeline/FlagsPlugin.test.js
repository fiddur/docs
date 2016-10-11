import { expect } from 'chai';
import { basename, resolve } from 'path';
import FlagsPlugin from '../../lib/pipeline/plugins/metadata/FlagsPlugin';

describe('FlagsPlugin', () => {

  const plugin = new FlagsPlugin();

  describe('when getMetadata() is called', () => {

    describe('for a normal filename', () => {
      const filename = resolve(__dirname, '..', 'docs/test.md');
      const hash = basename(filename);

      describe('with public and sitemap not set in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash }, '');
        it('sets public to true', () => expect(meta.public).to.equal(true));
        it('sets sitemap to true', () => expect(meta.sitemap).to.equal(true));
        it('sets isInclude to false', () => expect(meta.isInclude).to.equal(false));
        it('sets isSpecial to false', () => expect(meta.isSpecial).to.equal(false));
      });
      describe('with public set to false in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, public: false }, '');
        it('sets public to false', () => expect(meta.public).to.equal(false));
      });
      describe('with sitemap set to false in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, sitemap: false }, '');
        it('sets sitemap to false', () => expect(meta.sitemap).to.equal(false));
      });
    });

    describe('for a filename starting with an underscore', () => {
      const filename = resolve(__dirname, '..', 'docs/_partial.md');
      const hash = basename(filename);

      describe('with public and sitemap not set in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash }, '');
        it('sets public to false', () => expect(meta.public).to.equal(false));
        it('sets sitemap to false', () => expect(meta.sitemap).to.equal(false));
        it('sets isInclude to false', () => expect(meta.isInclude).to.equal(false));
        it('sets isSpecial to true', () => expect(meta.isSpecial).to.equal(true));
      });
      describe('with public set to true in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, public: true }, '');
        it('overrides public to false', () => expect(meta.public).to.equal(false));
      });
      describe('with sitemap set to true in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, sitemap: true }, '');
        it('overrides sitemap to false', () => expect(meta.sitemap).to.equal(false));
      });
    });

    describe('for a filename within an _includes directory', () => {
      const filename = resolve(__dirname, '..', 'docs/_includes/example.md');
      const hash = basename(filename);

      describe('with public and sitemap not set in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash }, '');
        it('sets public to false', () => expect(meta.public).to.equal(false));
        it('sets sitemap to false', () => expect(meta.sitemap).to.equal(false));
        it('sets isInclude to true', () => expect(meta.isInclude).to.equal(true));
        it('sets isSpecial to false', () => expect(meta.isSpecial).to.equal(false));
      });
      describe('with public set to true in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, public: true }, '');
        it('overrides public to false', () => expect(meta.public).to.equal(false));
      });
      describe('with sitemap set to true in metadata', () => {
        const meta = plugin.getMetadata({ filename, hash, sitemap: true }, '');
        it('overrides sitemap to false', () => expect(meta.sitemap).to.equal(false));
      });
    });

  });

});
