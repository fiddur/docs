import { expect } from 'chai';
import path from 'path';
import Compiler from '../../lib/pipeline/Compiler';
import File from '../../lib/pipeline/models/File';

describe('Compiler', () => {

  describe('when use() is called', () => {

    describe('with an invalid plugin', () => {
      const compiler = new Compiler();
      const plugin = {};
      it('throws an Error', () => {
        const func = () => compiler.use(plugin);
        expect(func).to.throw(/invalid plugin/);
      });
    });

    describe('with a valid plugin', () => {
      const compiler = new Compiler();
      const plugin = { transform: (meta, content) => content };
      compiler.use(plugin);
      it('adds the plugin to the end of the pipeline', () => {
        expect(compiler.plugins.length).to.equal(1);
        expect(compiler.plugins[0]).to.equal(plugin);
      });
    });

  });

  describe('when compile() is called', () => {
  });

});
