import { expect } from 'chai';
import { resolve } from 'path';
import ReplaceMediaPathPlugin from '../../lib/pipeline/plugins/content/ReplaceMediaPathPlugin';

describe('ReplaceMediaPathPlugin', () => {

  describe('when transform() is called', () => {

    describe('when the content contains an src attribute with the prefix', () => {
      it('replaces the prefix with the mediaUrl', () => {
        const { prefix, mediaUrl } = ReplaceMediaPathPlugin.defaults;
        const plugin = new ReplaceMediaPathPlugin();
        const content = `<img src="/${prefix}/example.jpg" />`;
        const transformed = plugin.transform({}, content);
        expect(transformed).to.equal(`<img src="${mediaUrl}/example.jpg" />`);
      });
    });

  });

});
