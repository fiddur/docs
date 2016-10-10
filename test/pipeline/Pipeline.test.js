import { expect } from 'chai';
import { resolve } from 'path';
import Pipeline from '../../lib/pipeline/Pipeline';
import Compiler from '../../lib/pipeline/Compiler';
import Cache from '../../lib/pipeline/Cache';
import File from '../../lib/pipeline/models/File';
import FakeScanner from './mocks/FakeScanner';

describe('Pipeline', () => {

  const createPipeline = () => new Pipeline({
    scanner: new FakeScanner({ baseDir: resolve(__dirname, 'docs') }),
    compiler: new Compiler(),
    cache: new Cache(),
    renderContext: {}
  });

  describe('when use() is called', () => {

    describe('with an invalid plugin', () => {
      const pipeline = createPipeline();
      const plugin = {};
      it('throws an Error', () => {
        const func = () => pipeline.use(plugin);
        expect(func).to.throw(/invalid plugin/);
      });
    });

    describe('with a valid plugin', () => {
      const pipeline = createPipeline();
      const plugin = { transform: (meta, content) => content };
      pipeline.use(plugin);
      it('adds the plugin to the end of the pipeline', () => {
        expect(pipeline.plugins.length).to.equal(1);
        expect(pipeline.plugins[0]).to.equal(plugin);
      });
    });

  });

});
