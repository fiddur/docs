import { expect } from 'chai';
import path from 'path';
import Scanner from '../../lib/pipeline/Scanner';
import File from '../../lib/pipeline/models/File';

describe('Scanner', () => {
  const scanner = new Scanner({ baseDir: path.resolve(__dirname, '../../docs') });

  describe('when scan() is called', () => {

    describe('with an invalid relative path', () => {
      it('throws an Error', () => {
        const func = () => scanner.scan('does-not-exist');
        expect(func).to.throw(/ENOENT/);
      });
    });

    describe('with a valid relative path', () => {
      const result = scanner.scan('articles');
      it('returns an array of Files', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length.above(0);
        expect(result[0]).to.be.an.instanceof(File);
      });
    });

  });
});
