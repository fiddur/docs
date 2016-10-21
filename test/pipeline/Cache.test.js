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

describe('Cache', () => {

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

  describe('when watcher emits an add event', () => {

    let cache;
    const vars = { environment: 'test' };
    const baseDir = resolve(__dirname, 'docs');
    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });

    beforeEach(() => {
      cache = new Cache({ watcher, compiler });
    });

    describe('for a file that matches one of the documentPaths expressions', () => {
      it('compiles the file to a document and adds it to the cache', () => {
        const path = 'articles/test.html';
        watcher.emit('add', File.load(baseDir, path));
        const doc = cache.get(path);
        expect(doc).to.be.instanceof(Document);
      });
    });

  });

  describe('when watcher emits a change event', () => {

    let cache;
    const vars = { environment: 'test' };
    const baseDir = resolve(__dirname, 'docs');
    const watcher = new FakeWatcher({ baseDir });
    const compiler = new Compiler({ vars });
    compiler.use(new MarkdownPlugin());
    compiler.use(new ReplaceIncludesPlugin({ snippetsDir: resolve(__dirname, 'docs/snippets') }));

    beforeEach(() => {
      cache = new Cache({ watcher, compiler });
    });

    describe('for an existing document', () => {
      it('recompiles the document', () => {
        const path = 'articles/include-recursive.html';
        const file = {
          path,
          filename: resolve(baseDir, path),
          text: 'original content'
        };
        watcher.emit('add', file);
        let doc = cache.get(path);
        expect(doc.content).to.equal('original content');
        file.text = 'new content';
        watcher.emit('change', file);
        doc = cache.get(path);
        expect(doc.content).to.equal('new content');
      });
    });

    describe('for a dependency of existing documents', () => {
      it('recompiles all documents that depend on the changed file', () => {
      });
    });

  });

});
