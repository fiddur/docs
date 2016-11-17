import { expect } from 'chai';
import { extname, relative, resolve } from 'path';
import lsr from 'lsr';
import { createProductionPipeline } from '../util';
import Tree from '../../lib/pipeline/models/Tree';

describe('Snippets Reduction', () => {

  const snippetsDir = resolve(__dirname, '../../docs/snippets');
  const expectedPaths = lsr
    .sync(snippetsDir)
    .filter(file => ['.md', '.html'].indexOf(extname(file)) !== -1)
    .map(file => relative(snippetsDir, file.fullPath).replace(extname(file.name)));

  let cache;
  let reduction;

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      reduction = pipeline.getReduction('snippets');
      done();
    });
  });

  it('reduces to a Tree', () => {
    expect(reduction).to.be.an.instanceof(Tree);
  });

  it('adds an item for each snippet', () => {
    expectedPaths.forEach(path => {
      const entry = reduction.get(path);
      expect(entry).to.be.an('object');
      expect(entry.content).to.be.a('string');
    });
  });

  it('compiles Markdown content to HTML', () => {
    expectedPaths.forEach(path => {
      const entry = reduction.get(path);
      const { content } = entry;
      const message = `The snippet at ${path} contains invalid Markdown characters.`;
      expect(content).not.to.contain('```', message);
      expect(content).not.to.contain('###', message);
      expect(content).not.to.contain('![](', message);
    });
  });

});
