import { expect } from 'chai';
import touch from 'touch';
import { resolve } from 'path';
import Scanner from '../../lib/pipeline/Scanner';
import File from '../../lib/pipeline/models/File';

describe('Scanner', () => {

  let scanner;
  const expectedFiles = [
    'docs/test.md',
    'docs/test.html'
  ];

  beforeEach(() => {
    scanner = new Scanner({ baseDir: __dirname });
  });

  describe('when scan() is called', () => {

    it('emits add events for each matching file in the path', (done) => {
      let count = 0;
      scanner.on('add', file => {
        count++;
        expect(file).to.be.instanceof(File);
        expect(expectedFiles).to.include(file.path, `Scanner returned unexpected file ${file.filename}`);
        if (count === expectedFiles.length) setImmediate(done);
      });
      scanner.scan('docs');
    });

  });

  describe('when a file changes after it has been scanned', () => {

    it('emits a change event for the file', (done) => {
      const filename = 'docs/test.md';
      scanner.on('change', file => {
        expect(file.path).to.equal(filename);
        done();
      });
      scanner.scan('docs');
      touch.sync(resolve(__dirname, filename));
    });

  });

});
