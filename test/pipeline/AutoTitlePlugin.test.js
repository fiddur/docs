import { expect } from 'chai';
import AutoTitlePlugin from '../../lib/pipeline/plugins/metadata/AutoTitlePlugin';

const EXAMPLES = {
  AlreadyHasTitle: {
    meta: { title: 'Title on document' },
    content: '# Title in Content\nThis is an example document.'
  },
  TitleInContent: {
    meta: {},
    content: '# Title in Content\nThis is an example document.'
  },
  NoTitle: {
    meta: {},
    content: 'This is an example document.'
  }
};

describe('AutoTitlePlugin', () => {

  describe('when getMetadata() is called', () => {

    describe('with the title already set on document', () => {
      it('does not return a new title', () => {
        const plugin = new AutoTitlePlugin();
        const example = EXAMPLES.AlreadyHasTitle;
        const meta = plugin.getMetadata(example.meta, example.content);
        expect(meta).to.equal(null);
      });
    });

    describe('with the title not set on document, but available in content', () => {
      it('extracts the title from the content', () => {
        const plugin = new AutoTitlePlugin();
        const example = EXAMPLES.TitleInContent;
        const meta = plugin.getMetadata(example.meta, example.content);
        expect(meta).to.deep.equal({ title: 'Title in Content' });
      });
    });

    describe('with the title not set on document, nor available in content', () => {
      it('sets a default title on the Document', () => {
        const plugin = new AutoTitlePlugin();
        const example = EXAMPLES.NoTitle;
        const meta = plugin.getMetadata(example.meta, example.content);
        expect(meta).to.deep.equal({ title: AutoTitlePlugin.defaults.defaultTitle });
      });
      it('allows overriding of the default title', () => {
        const defaultTitle = 'Test Default Title';
        const plugin = new AutoTitlePlugin({ defaultTitle });
        const example = EXAMPLES.NoTitle;
        const meta = plugin.getMetadata(example.meta, example.content);
        expect(meta).to.deep.equal({ title: defaultTitle });
      });
    });

  });

});
