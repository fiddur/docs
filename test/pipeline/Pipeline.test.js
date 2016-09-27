import { expect } from 'chai';
import { resolve } from 'path';
import Pipeline from '../../lib/pipeline/Pipeline';
import Compiler from '../../lib/pipeline/Compiler';
import Cache from '../../lib/pipeline/Cache';
import File from '../../lib/pipeline/models/File';

const mockScanner = {
  scan: (dir) => [
    new File(
      resolve(__dirname, 'articles/test1.md'),
      '/articles/test1.md',
      'This is an *example* document.'
    ),
    new File(
      resolve(__dirname, 'articles/test2.md'),
      '/articles/test2.md',
      'This is a another _example_ document.'
    )
  ]
};

const createPipeline = () => new Pipeline({
  scanner: mockScanner,
  compiler: new Compiler(),
  cache: new Cache(),
  renderContext: {}
});

describe('Pipeline', () => {

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
