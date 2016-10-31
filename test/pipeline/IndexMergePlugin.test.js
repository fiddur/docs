import { expect } from 'chai';
import { resolve } from 'path';
import IndexMergePlugin from '../../lib/pipeline/plugins/metadata/IndexMergePlugin';

describe('IndexMergePlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('for a file with an index.yml file in the same directory', () => {
      it('returns the metadata read from the index.yml file', () => {
        const plugin = new IndexMergePlugin();
        const doc = { filename: resolve(__dirname, 'docs/articles/test.md') };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ items: ['one', 'two', 'three'] });
      });
    });

  });

});
