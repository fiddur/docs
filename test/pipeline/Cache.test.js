import { expect } from 'chai';
import { resolve } from 'path';
import Cache from '../../lib/pipeline/Cache';

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

});
