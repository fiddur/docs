import { basename, extname } from 'path';
import { expect } from 'chai';
import matter from 'gray-matter';
import FakeWatcher from './mocks/FakeWatcher';
import getTestFile from './util/getTestFile';
import Compiler from '../../lib/pipeline/Compiler';
import Document from '../../lib/pipeline/models/Document';

describe('Compiler', () => {

  const vars = { environment: 'test' };

  describe('when the constructor is called', () => {
    describe('without a vars option', () => {
      it('throws an Error', () => {
        const func = () => new Compiler();
        expect(func).to.throw(/vars option/);
      });
    });
  });

  describe('when use() is called', () => {
    const compiler = new Compiler({ vars });
    describe('with an invalid plugin', () => {
      const plugin = {};
      it('throws an Error', () => {
        const func = () => compiler.use(plugin);
        expect(func).to.throw(/invalid plugin/);
      });
    });
    describe('with a valid plugin', () => {
      const plugin = { transform: (meta, content) => content };
      compiler.use(plugin);
      it('adds the plugin to the end of the compiler pipeline', () => {
        expect(compiler.plugins.length).to.equal(1);
        expect(compiler.plugins[0]).to.equal(plugin);
      });
    });
  });

  describe('when compile() is called with a File', () => {

    const file = getTestFile('articles/test.html');
    const cache = {};
    const expectedContent = 'title = HTML Test File, example = this is read from front matter, environment = test';
    let compiler;

    beforeEach(() => {
      compiler = new Compiler({ vars });
    });

    it('returns a Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc).to.be.instanceof(Document);
    });

    it('adds basic metadata to the Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.path).to.equal(file.path);
      expect(doc.filename).to.equal(file.filename);
      expect(doc.basename).to.equal(basename(file.filename));
      expect(doc.extension).to.equal(extname(file.filename));
      expect(doc.hash).to.equal(basename(file.filename).replace(extname(file.filename), ''));
    });

    it('merges metadata from document front matter into the Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.meta.title).to.equal('HTML Test File');
      expect(doc.meta.example).to.equal('this is read from front matter');
    });

    it('merges metadata from metadata plugins into the Document', () => {
      compiler.use({ getMetadata(doc, content) { return { foo: 42 }; } });
      compiler.use({ getMetadata(doc, content) { return { bar: 123 }; } });
      const doc = compiler.compile(file, cache);
      expect(doc.meta.foo).to.equal(42);
      expect(doc.meta.bar).to.equal(123);
    });

    it('adds the rendered content to the Document, making available vars and metadata', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.getContent()).to.equal(expectedContent);
    });

    it('allows content plugins to transform Document content in a stepwise fashion', () => {
      compiler.use({ transform(doc, content) { return `ONE(${content})`; } });
      compiler.use({ transform(doc, content) { return `TWO(${content})`; } });
      const doc = compiler.compile(file, cache);
      const raw = matter(file.text);
      expect(doc.getContent()).to.equal(`TWO(ONE(${expectedContent}))`);
    });
  });

});
