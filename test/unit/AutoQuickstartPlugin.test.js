import { expect } from 'chai';
import AutoQuickstartPlugin from '../../lib/pipeline/plugins/metadata/AutoQuickstartPlugin';
import { getTestDocument, getTestFile } from '../util';

describe('AutoQuickstartPlugin', () => {

  const appTypes = [
    { title: 'Example', name: 'example-apptype', slug: 'example-apptype', flavor: 'vanilla' }
  ];

  const plugin = new AutoQuickstartPlugin({ appTypes });

  describe('when getMetadata() is called', () => {

    describe('with a quickstart flag already set in the document metadata', () => {
      it('does not return a patch', () => {
        const doc = { quickstart: true };
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

    describe('for a document within a quickstart path', () => {
      it('returns a true quickstart flag', () => {
        const doc = getTestDocument(getTestFile('articles/quickstart/example-apptype/platform-a/01-example.md'));
        const output = plugin.getMetadata(doc, '');
        expect(output).to.deep.equal({ quickstart: true });
      });
    });

    describe('for a document not within a quickstart path', () => {
      it('does not return a patch', () => {
        const doc = getTestDocument(getTestFile('articles/test-markdown.md'));
        const output = plugin.getMetadata(doc, '');
        expect(output).to.equal(null);
      });
    });

  });

});
