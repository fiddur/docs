import { expect } from 'chai';
import { resolve } from 'path';
import IndexMergePlugin from '../../lib/pipeline/plugins/metadata/IndexMergePlugin';
import { getTestDocument, getTestFile } from '../util';

describe('IndexMergePlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('for a file with an index.yml file in the same directory', () => {
      it('returns the metadata read from the index.yml file', () => {
        const plugin = new IndexMergePlugin();
        const doc = getTestDocument(getTestFile('articles/test-markdown.md'));
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({
          items: ['one', 'two', 'three']
        });
      });
    });

  });

});
