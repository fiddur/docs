import { basename, extname } from 'path';
import { expect } from 'chai';
import matter from 'gray-matter';
import getTestFile from './util/getTestFile';
import Compiler from '../../lib/pipeline/Compiler';
import Document from '../../lib/pipeline/models/Document';

describe('Compiler', () => {

  describe('when use() is called', () => {
    const compiler = new Compiler();
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
    const compiler = new Compiler();
    compiler.use({ getMetadata(meta, content) { return { foo: 42 }; } });
    compiler.use({ getMetadata(meta, content) { return { bar: 123 }; } });
    compiler.use({ transform(meta, content) { return `ONE(${content})`; } });
    compiler.use({ transform(meta, content) { return `TWO(${content})`; } });

    it('returns a Document', () => {
      const doc = compiler.compile(file);
      expect(doc).to.be.instanceof(Document);
    });

    it('adds basic metadata to the Document', () => {
      const doc = compiler.compile(file);
      expect(doc.path).to.equal(file.path);
      expect(doc.filename).to.equal(file.filename);
      expect(doc.hash).to.equal(basename(file.filename));
      expect(doc.extension).to.equal(extname(file.filename));
    });

    it('merges metadata from document front matter into the Document', () => {
      const doc = compiler.compile(file);
      expect(doc.title).to.equal('HTML Test File');
      expect(doc.example).to.equal('this is read from front matter');
    });

    it('merges metadata from metadata plugins into the Document', () => {
      const doc = compiler.compile(file);
      expect(doc.foo).to.equal(42);
      expect(doc.bar).to.equal(123);
    });

    it('allows content plugins to transform Document content in a stepwise fashion', () => {
      const doc = compiler.compile(file);
      const raw = matter(file.text);
      const content = doc.template({});
      expect(content).to.equal(`TWO(ONE(${raw.content}))`);
    });

  });

});
