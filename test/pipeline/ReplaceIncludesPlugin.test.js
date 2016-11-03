import { expect } from 'chai';
import { resolve } from 'path';
import { template } from 'lodash';
import getTestFile from './util/getTestFile';
import ReplaceIncludesPlugin from '../../lib/pipeline/plugins/content/ReplaceIncludesPlugin';
import Document from '../../lib/pipeline/models/Document';

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
    const process = (doc, file) => {
      const content = plugin.transform(doc, file.text);
      return template(content)({ meta: doc });
    };

    describe('when the content contains a call to include()', () => {
      it('adds the included file as a dependency', () => {
        const file = getTestFile('articles/include-markdown.html');
        const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
        process(doc, file);
        const filename = resolve(__dirname, 'docs/articles/_includes/markdown.md');
        expect(doc.dependencies.has(filename)).to.equal(true);
      });
    });

    describe('when the content contains a call to include() for a markdown file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('articles/include-markdown.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: <p>Markdown <em>include</em>: foo = meta-foo, bar = meta-bar</p>\n');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('articles/include-markdown-locals.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: <p>Markdown <em>include</em>: foo = locals-foo, bar = locals-bar</p>\n');
        });
      });
    });

    describe('when the content contains a call to include() for an HTML file', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('articles/include-html.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: HTML include: foo = meta-foo, bar = meta-bar');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('articles/include-html-locals.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: HTML include: foo = locals-foo, bar = locals-bar');
        });
      });
    });

    describe('when the content contains a call to include() for a recursive include', () => {
      describe('without a hash of local variables', () => {
        it('inserts the included content using variables from metadata', () => {
          const file = getTestFile('articles/include-recursive.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: Recursive include: <p>Markdown <em>include</em>: foo = meta-foo, bar = meta-bar</p>\n');
        });
      });
      describe('with a hash of local variables', () => {
        it('inserts the included content using variables from the local hash', () => {
          const file = getTestFile('articles/include-recursive-locals.html');
          const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
          const content = process(doc, file);
          expect(content).to.equal('Here is an include: Recursive include: <p>Markdown <em>include</em>: foo = locals-foo, bar = locals-bar</p>\n');
        });
      });
    });

    describe('when the content contains multiple calls to include()', () => {
      it('processes both includes correctly', () => {
        const file = getTestFile('articles/include-multiple.html');
        const doc = new Document(file, { foo: 'meta-foo', bar: 'meta-bar' });
        const content = process(doc, file);
        expect(content).to.equal(
          'Here is an include: <p>Markdown <em>include</em>: foo = meta-foo, bar = meta-bar</p>\n\n' +
          'And another: HTML include: foo = locals-foo, bar = locals-bar'
        );
      });
    });

    describe('when the content contains a call to snippet()', () => {
      it('adds the included file as a dependency', () => {
        const file = getTestFile('articles/include-snippet.html');
        const doc = new Document(file, {
          snippets: { example: 'example-snippet' },
          foo: 'meta-foo',
          bar: 'meta-bar'
        });
        process(doc, file);
        expect(doc.dependencies.has(resolve(__dirname, 'docs/snippets/example-snippet.md')));
      });
      it('inserts the included content', () => {
        const file = getTestFile('articles/include-snippet.html');
        const doc = new Document(file, {
          snippets: { example: 'example-snippet' },
          foo: 'meta-foo',
          bar: 'meta-bar'
        });
        const content = process(doc, file);
        expect(content).to.equal('Here is a snippet: <p>Snippet: foo = meta-foo, bar = meta-bar</p>\n');
      });
    });

  });

});
