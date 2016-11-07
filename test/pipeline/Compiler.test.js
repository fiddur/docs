import { basename, extname } from 'path';
import { expect } from 'chai';
import matter from 'gray-matter';
import _ from 'lodash';
import FakeCache from './mocks/FakeCache';
import getTestDocument from './util/getTestDocument';
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
      const plugin = { preprocess: (meta, content) => content };
      compiler.use(plugin);
      it('adds the plugin to the end of the compiler pipeline', () => {
        expect(compiler.plugins.length).to.equal(1);
        expect(compiler.plugins[0]).to.equal(plugin);
      });
    });
  });

  describe('when compile() is called with a File', () => {

    const file = getTestFile('articles/test-html.html');
    const expectedContent = 'title = HTML Test File, example = this is read from front matter, environment = test';
    let cache;
    let compiler;

    beforeEach(() => {
      compiler = new Compiler({ vars });
      cache = new FakeCache();
    });

    it('returns a Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc).to.be.instanceof(Document);
    });

    it('sets file-oriented properties on the Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.filename).to.equal(file.filename);
      expect(doc.shortname).to.equal('articles/test-html.html');
      expect(doc.basename).to.equal('test-html.html');
      expect(doc.extension).to.equal('.html');
      expect(doc.path).to.equal('articles/test-html');
      expect(doc.hash).to.equal('test-html');
    });

    it('merges metadata from document front matter into the Document', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.title).to.equal('HTML Test File');
      expect(doc.example).to.equal('this is read from front matter');
    });

    it('merges metadata from metadata plugins into the Document', () => {
      compiler.use({ getMetadata(doc, content) { return { foo: 42 }; } });
      compiler.use({ getMetadata(doc, content) { return { bar: 123 }; } });
      const doc = compiler.compile(file, cache);
      expect(doc.foo).to.equal(42);
      expect(doc.bar).to.equal(123);
    });

    it('adds the rendered content to the Document, making available vars and metadata', () => {
      const doc = compiler.compile(file, cache);
      expect(doc.getContent()).to.equal(expectedContent);
    });

    it('allows preprocessor plugins to transform Document content in a stepwise fashion', () => {
      compiler.use({ preprocess(doc, content) { return `ONE(${content})`; } });
      compiler.use({ preprocess(doc, content) { return `TWO(${content})`; } });
      const doc = compiler.compile(file, cache);
      const raw = matter(file.text);
      expect(doc.getContent()).to.equal(`TWO(ONE(${expectedContent}))`);
    });

    describe('with a call to cache.get()', () => {
      const dependent = getTestFile('articles/cache-get.html');
      const parent = getTestDocument(getTestFile('articles/test-markdown.md'));
      it('gets the requested doc from the cache', () => {
        cache.add(parent);
        const child = compiler.compile(dependent, cache);
        const content = child.render();
        expect(content).to.equal('The path of the cached document is articles/test-markdown');
      });
      it('adds the returned doc as a dependency', () => {
        cache.add(parent);
        const child = compiler.compile(dependent, cache);
        const content = child.render();
        expect(child.hasDependency(parent.filename)).to.be.true;
      });
    });

    describe('with a call to cache.find()', () => {
      const dependent = getTestFile('articles/cache-find.html');
      const parent1 = getTestDocument(getTestFile('articles/test-markdown.md'));
      const parent2 = getTestDocument(getTestFile('articles/test-html.html'));
      it('gets the requested docs from the cache', () => {
        cache.add(parent1);
        cache.add(parent2);
        const child = compiler.compile(dependent, cache);
        const content = child.render();
        expect(content).to.equal('The path of the cached documents are:\n\narticles/test-markdown\n\narticles/test-html\n');
      });
      it('adds the returned docs as dependencies', () => {
        cache.add(parent1);
        cache.add(parent2);
        const child = compiler.compile(dependent, cache);
        const content = child.render();
        expect(child.hasDependency(parent1.filename)).to.be.true;
        expect(child.hasDependency(parent2.filename)).to.be.true;
      });
    });

  });

});
