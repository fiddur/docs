import { expect } from 'chai';
import { resolve } from 'path';
import { merge } from 'lodash';
import Cache from '../../lib/pipeline/Cache';
import Compiler from '../../lib/pipeline/Compiler';
import MarkdownPlugin from '../../lib/pipeline/plugins/content/MarkdownPlugin';
import ReplaceIncludesPlugin from '../../lib/pipeline/plugins/content/ReplaceIncludesPlugin';
import File from '../../lib/pipeline/models/File';
import Document from '../../lib/pipeline/models/Document';
import FakeWatcher from './mocks/FakeWatcher';
import getTestFile from './util/getTestFile';

describe('Cache', () => {

  const vars = { environment: 'test' };
  const baseDir = resolve(__dirname, 'docs');

  describe('when constructor is called', () => {
    describe('without a compiler option', () => {
      it('throws an Error', () => {
        const func = () => new Cache({ watcher: {} });
        expect(func).to.throw(/requires a compiler option/);
      });
    });
    describe('without a watcher option', () => {
      it('throws an Error', () => {
        const func = () => new Cache({ compiler: {} });
        expect(func).to.throw(/requires a watcher option/);
      });
    });
  });

  describe('when get() is called', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    const cache = new Cache({ watcher, compiler });

    describe('with a path of a loaded document', () => {
      it('returns the document', () => {
        const doc = new Document(getTestFile('articles/test.md'));
        cache.add(doc);
        expect(cache.get(doc.path)).to.equal(doc);
      });
    });
    describe('with a non-existent path', () => {
      it('throws an Error', () => {
        const func = () => cache.get('does-not-exist');
        expect(func).to.throw(/exists in the cache/);
      });
    });

  });

  describe('when tryGet() is called', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    const cache = new Cache({ watcher, compiler });

    describe('with a path of a loaded document', () => {
      it('returns the document', () => {
        const doc = new Document(getTestFile('articles/test.md'));
        cache.add(doc);
        expect(cache.tryGet(doc.path)).to.equal(doc);
      });
    });
    describe('with a non-existent path', () => {
      it('returns undefined', () => {
        expect(cache.tryGet('does-not-exist')).to.equal(undefined);
      });
    });

  });

  describe('when getByFilename() is called', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    const cache = new Cache({ watcher, compiler });

    describe('with a path of a loaded document', () => {
      it('returns the document', () => {
        const doc = new Document(getTestFile('articles/test.md'));
        cache.add(doc);
        expect(cache.getByFilename(doc.filename)).to.equal(doc);
      });
    });
    describe('with a non-existent filename', () => {
      it('returns undefined', () => {
        expect(cache.getByFilename('does-not-exist')).to.equal(undefined);
      });
    });

  });

  describe('when getByUrl() is called', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    const cache = new Cache({ watcher, compiler });

    describe('with a path of a loaded document', () => {
      it('returns the document', () => {
        const doc = new Document(getTestFile('articles/test.md'));
        cache.add(doc);
        expect(cache.getByUrl(doc.meta.url)).to.equal(doc);
      });
    });
    describe('with a non-existent URL', () => {
      it('returns undefined', () => {
        expect(cache.getByUrl('does-not-exist')).to.equal(undefined);
      });
    });

  });

  describe('when find() is called', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    const cache = new Cache({ watcher, compiler });

    describe('with a path of a loaded document', () => {
      it('returns the document', () => {
        const doc1 = new Document(getTestFile('articles/test.html'));
        const doc2 = new Document(getTestFile('articles/test.md'));
        cache.add(doc1);
        cache.add(doc2);
        expect(cache.find('articles')).to.eql([doc1, doc2]);
      });
    });
    describe('with a query that matches no documents', () => {
      it('returns an empty array', () => {
        expect(cache.find('does-not-exist')).to.eql([]);
      });
    });

  });

  describe('when watcher emits an add event', () => {

    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    let cache;

    beforeEach(() => {
      cache = new Cache({ watcher, compiler });
    });

    describe('for a file that matches one of the documentPaths expressions', () => {
      it('compiles the file to a document and adds it to the cache', () => {
        const path = 'articles/test.html';
        watcher.emit('add', watcher.load(path));
        const doc = cache.get(path);
        expect(doc).to.be.instanceof(Document);
      });
    });

  });

  describe('when watcher emits a change event', () => {

    const compiler = new Compiler({ vars });
    let watcher;
    let cache;

    compiler.use({ getMetadata() { return { foo: 'abc', bar: 'def' }; } });
    compiler.use(new MarkdownPlugin());
    compiler.use(new ReplaceIncludesPlugin({ snippetsDir: resolve(__dirname, 'docs/snippets') }));

    beforeEach(() => {
      watcher = new FakeWatcher({ baseDir });
      cache = new Cache({ watcher, compiler });
    });

    describe('for an existing document', () => {
      it('recompiles the document', () => {
        const path = 'articles/include-recursive.html';
        const filename = resolve(baseDir, path);
        let compiledFiles = {};
        cache.on('add', doc => {
          compiledFiles[doc.filename] = true;
        });
        watcher.emit('add', watcher.load(path));
        expect(compiledFiles).to.have.all.keys(filename);
        compiledFiles = [];
        watcher.emit('change', watcher.load(path));
        expect(compiledFiles).to.have.all.keys(filename);
      });
    });

    describe('for a dependency of existing documents', () => {
      it('recompiles all documents that depend on the changed file', () => {
        let compiledFiles = {};
        cache.on('add', doc => {
          compiledFiles[doc.filename] = true;
        });
        watcher.emit('add', watcher.load('articles/include-recursive.html'));
        watcher.emit('add', watcher.load('articles/include-markdown.html'));
        expect(compiledFiles).to.have.all.keys([
          resolve(baseDir, 'articles/include-recursive.html'),
          resolve(baseDir, 'articles/include-markdown.html')
        ]);
        compiledFiles = {};
        watcher.emit('change', watcher.load('articles/_includes/markdown.md'));
        expect(compiledFiles).to.have.all.keys([
          resolve(baseDir, 'articles/include-recursive.html'),
          resolve(baseDir, 'articles/include-markdown.html')
        ]);
      });
    });

  });

});
