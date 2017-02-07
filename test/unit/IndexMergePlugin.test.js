import { expect } from 'chai';
import { resolve } from 'path';
import IndexMergePlugin from '../../lib/pipeline/plugins/metadata/IndexMergePlugin';
import { getTestDocument, getTestFile } from '../util';

describe('IndexMergePlugin', () => {

  const baseDir = resolve(__dirname, '../docs');
  const plugin = new IndexMergePlugin({ baseDir });

  describe('when getMetadata() is called', () => {

    describe('for a file with an index.yml file in the same directory', () => {
      it('returns the metadata read from the index.yml file', () => {
        const doc = getTestDocument(getTestFile('articles/test-markdown.md'));
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({
          image: 'example.png',
          items: ['one', 'two', 'three']
        });
      });
    });

    describe('for a file with multiple overlapping index.yml files', () => {
      it('returns the merged metadata read from the index.yml files', () => {
        const doc = getTestDocument(getTestFile('articles/example-quickstarts/platform-a/01-example.md'));
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({
          image: '/media/platforms/platform-a.png',
          default_article: '01-example',
          articles: ['01-example'],
          items: ['one', 'two', 'three']
        });
      });
    });

  });

});
