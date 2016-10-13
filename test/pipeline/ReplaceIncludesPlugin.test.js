import { expect } from 'chai';
import { resolve } from 'path';
import getTestFile from './util/getTestFile';
import Document from '../../lib/pipeline/models/Document';
import ReplaceIncludesPlugin from '../../lib/pipeline/plugins/content/ReplaceIncludesPlugin';

describe('ReplaceIncludesPlugin', () => {

  describe('when the constructor is called', () => {
    describe('without a snippetsDir option', () => {
      it('throws an Error', () => {
        const func = () => new ReplaceIncludesPlugin();
        expect(func).to.throw(/requires a snippetsDir option/);
      });
    });
  });

  describe('when transform() is called', () => {

    const plugin = new ReplaceIncludesPlugin({ snippetsDir: resolve(__dirname, 'docs/snippets') });

    describe('when the content contains a call to include()', () => {
      it('adds the included file as a dependency', () => {
        const file = getTestFile('docs/articles/include-markdown.md');
        const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
        plugin.transform(doc, file.text);
        expect(doc.dependencies.has(resolve(__dirname, 'docs/articles/_includes/markdown.md')));
      });
    });

    describe('when the content contains a call to include() for a markdown file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('docs/articles/include-markdown.md');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const transformed = plugin.transform(doc, file.text);
          expect(transformed).to.equal('Here is an include: <p>Markdown include: foo = meta-foo, bar = meta-bar</p>\n');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('docs/articles/include-markdown-locals.md');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const transformed = plugin.transform(doc, file.text);
          expect(transformed).to.equal('Here is an include: <p>Markdown include: foo = locals-foo, bar = locals-bar</p>\n');
        });
      });
    });

    describe('when the content contains a call to include() for an HTML file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('docs/articles/include-html.md');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const transformed = plugin.transform(doc, file.text);
          expect(transformed).to.equal('Here is an include: HTML include: foo = meta-foo, bar = meta-bar');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('docs/articles/include-html-locals.md');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const transformed = plugin.transform(doc, file.text);
          expect(transformed).to.equal('Here is an include: HTML include: foo = locals-foo, bar = locals-bar');
        });
      });
    });

    describe('when the content contains multiple calls to include()', () => {
      it('processes both includes correctly', () => {
        const file = getTestFile('docs/articles/include-multiple.md');
        const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
        const transformed = plugin.transform(doc, file.text);
        expect(transformed).to.equal(
          'Here is an include: <p>Markdown include: foo = meta-foo, bar = meta-bar</p>\n\n' +
          'And another: HTML include: foo = locals-foo, bar = locals-bar'
        );
      });
    });

    describe('when the content contains a call to snippet()', () => {
      it('adds the included file as a dependency', () => {
        const file = getTestFile('docs/articles/include-snippet.md');
        const doc = new Document(file, {
          snippets: { example: 'example-snippet' },
          foo: 'meta-foo',
          bar: 'meta-bar'
        });
        plugin.transform(doc, file.text);
        expect(doc.dependencies.has(resolve(__dirname, 'docs/snippets/example-snippet.md')));
      });
      it('inserts the included content', () => {
        const file = getTestFile('docs/articles/include-snippet.md');
        const doc = new Document(file, {
          snippets: { example: 'example-snippet' },
          foo: 'meta-foo',
          bar: 'meta-bar'
        });
        const transformed = plugin.transform(doc, file.text);
        expect(transformed).to.equal('Here is a snippet: <p>Snippet: foo = meta-foo, bar = meta-bar</p>\n');
      });
    });

  });

});
