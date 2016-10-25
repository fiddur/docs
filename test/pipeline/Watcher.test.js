import { expect } from 'chai';
import touch from 'touch';
import { resolve } from 'path';
import Watcher from '../../lib/pipeline/Watcher';
import File from '../../lib/pipeline/models/File';

describe('Watcher', () => {

  let watcher;
  const baseDir = resolve(__dirname, 'docs');
  const expectedFiles = [
    'articles/_includes/html.html',
    'articles/_includes/markdown.md',
    'articles/_includes/recursive.html',
    'articles/_partial.md',
    'articles/cache-find.html',
    'articles/cache-get.html',
    'articles/include-html.html',
    'articles/include-html-locals.html',
    'articles/include-markdown.html',
    'articles/include-markdown-locals.html',
    'articles/include-multiple.html',
    'articles/include-recursive.html',
    'articles/include-recursive-locals.html',
    'articles/include-snippet.html',
    'articles/test.md',
    'articles/test.html'
  ];

  beforeEach(() => {
    watcher = new Watcher({ baseDir });
  });

  describe('when watch() is called', () => {

    it('emits add events for each matching file in the path', (done) => {
      let count = 0;
      watcher.on('add', file => {
        count++;
        expect(file).to.be.instanceof(File);
        expect(expectedFiles).to.include(file.path, `Watcher returned unexpected file ${file.filename}`);
        if (count === expectedFiles.length) setImmediate(done);
      });
      watcher.watch('articles');
    });

    it('emits ready event once all files have been found', (done) => {
      let count = 0;
      watcher.on('add', file => count++);
      watcher.on('ready', () => {
        expect(count).to.equal(expectedFiles.length);
        done();
      });
      watcher.watch('articles');
    });

  });

  describe('when a file changes after it has been found', () => {

    it('emits a change event for the file', (done) => {
      const filename = 'articles/test.md';
      watcher.on('change', file => {
        expect(file.path).to.equal(filename);
        done();
      });
      watcher.watch('articles');
      touch.sync(resolve(baseDir, filename));
    });

  });

});
