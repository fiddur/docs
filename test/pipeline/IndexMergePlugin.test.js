import { expect } from 'chai';
import { resolve } from 'path';
import IndexMergePlugin from '../../lib/pipeline/plugins/metadata/IndexMergePlugin';

describe('IndexMergePlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('for a file with an index.yml file in the same directory', () => {
      it('returns the metadata read from the index.yml file', () => {
        const filename = resolve(__dirname, 'docs/test.md');
        const plugin = new IndexMergePlugin();
        const meta = plugin.getMetadata({ filename }, '');
        expect(meta).to.deep.equal({ items: ['one', 'two', 'three'] });
      });
    });

  });

});
