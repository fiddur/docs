import { expect } from 'chai';
import { resolve } from 'path';
import getTestFile from './util/getTestFile';
import ReplaceIncludesPlugin from '../../lib/pipeline/plugins/content/ReplaceIncludesPlugin';

describe('ReplaceIncludesPlugin', () => {

  describe('when transform() is called', () => {

    describe('when the content contains an include for a markdown file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('docs/include-markdown.md');
          const plugin = new ReplaceIncludesPlugin();
          const meta = { filename: file.filename, foo: 'meta-foo', bar: 'meta-bar' };
          const transformed = plugin.transform(meta, file.text);
          expect(transformed).to.equal('Here is an include: <p>Markdown include: foo = meta-foo, bar = meta-bar</p>\n');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('docs/include-markdown-locals.md');
          const plugin = new ReplaceIncludesPlugin();
          const meta = { filename: file.filename, foo: 'meta-foo', bar: 'meta-bar' };
          const transformed = plugin.transform(meta, file.text);
          expect(transformed).to.equal('Here is an include: <p>Markdown include: foo = locals-foo, bar = locals-bar</p>\n');
        });
      });
    });

    describe('when the content contains an include for an HTML file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('docs/include-html.md');
          const plugin = new ReplaceIncludesPlugin();
          const meta = { filename: file.filename, foo: 'meta-foo', bar: 'meta-bar' };
          const transformed = plugin.transform(meta, file.text);
          expect(transformed).to.equal('Here is an include: HTML include: foo = meta-foo, bar = meta-bar');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('docs/include-html-locals.md');
          const plugin = new ReplaceIncludesPlugin();
          const meta = { filename: file.filename, foo: 'meta-foo', bar: 'meta-bar' };
          const transformed = plugin.transform(meta, file.text);
          expect(transformed).to.equal('Here is an include: HTML include: foo = locals-foo, bar = locals-bar');
        });
      });
    });

    describe('when the content contains multiple includes', () => {
      it('processes both includes correctly', () => {
        const file = getTestFile('docs/include-multiple.md');
        const plugin = new ReplaceIncludesPlugin();
        const meta = { filename: file.filename, foo: 'meta-foo', bar: 'meta-bar' };
        const transformed = plugin.transform(meta, file.text);
        expect(transformed).to.equal(
          'Here is an include: <p>Markdown include: foo = meta-foo, bar = meta-bar</p>\n\n' +
          'And another: HTML include: foo = locals-foo, bar = locals-bar'
        );
      });
    });

  });

});
