import { basename, extname } from 'path';
import { expect } from 'chai';
import matter from 'gray-matter';
import getTestFile from './util/getTestFile';
import Compiler from '../../lib/pipeline/Compiler';
import Document from '../../lib/pipeline/models/Document';

describe('Compiler', () => {

  let compiler;
  const file = getTestFile('docs/articles/test.html');

  const metadataPlugins = [
    { getMetadata(meta, content) { return { foo: 42 }; } },
    { getMetadata(meta, content) { return { bar: 123 }; } }
  ];

  const contentPlugins = [
    { transform(meta, content) { return `ONE(${content})`; } },
    { transform(meta, content) { return `TWO(${content})`; } }
  ];

  beforeEach(() => {
    compiler = new Compiler();
  });

  describe('when compile() is called with a File', () => {

    it('returns a Document', () => {
      const doc = compiler.compile(file, metadataPlugins, contentPlugins);
      expect(doc).to.be.instanceof(Document);
    });

    it('adds basic metadata to the Document', () => {
      const doc = compiler.compile(file, metadataPlugins, contentPlugins);
      expect(doc.path).to.equal(file.path);
      expect(doc.filename).to.equal(file.filename);
      expect(doc.hash).to.equal(basename(file.filename));
      expect(doc.extension).to.equal(extname(file.filename));
    });

    it('merges metadata from document front matter into the Document', () => {
      const doc = compiler.compile(file, metadataPlugins, contentPlugins);
      expect(doc.title).to.equal('HTML Test File');
      expect(doc.example).to.equal('this is read from front matter');
    });

    it('merges metadata from metadata plugins into the Document', () => {
      const doc = compiler.compile(file, metadataPlugins, contentPlugins);
      expect(doc.foo).to.equal(42);
      expect(doc.bar).to.equal(123);
    });

    it('allows content plugins to transform Document content in a stepwise fashion', () => {
      const doc = compiler.compile(file, metadataPlugins, contentPlugins);
      const raw = matter(file.text);
      const content = doc.template({});
      expect(content).to.equal(`TWO(ONE(${raw.content}))`);
    });

  });

});
