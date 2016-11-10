import { expect } from 'chai';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import NormalizeUrlsPlugin from '../../lib/pipeline/plugins/metadata/NormalizeUrlsPlugin';

describe('NormalizeUrlsPlugin', () => {

  const baseUrl = 'https://tests.local/';
  const mediaUrl = 'https://cdn.cloud/';
  const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });

  const imageTag = (url) => `<img src="${url}">`;
  const anchorTag = (url) => `<a href="${url}">Example Link</a>`;

  describe('when the constructor is called', () => {
    describe('without a urlFormatter option', () => {
      it('throws an Error', () => {
        const func = () => new NormalizeUrlsPlugin();
        expect(func).to.throw(/requires a urlFormatter option/);
      });
    });
  });

  describe('when getMetadata() is called', () => {

    const plugin = new NormalizeUrlsPlugin({ urlFormatter });

    describe('with a document with a url property', () => {
      it('formats the url using the UrlFormatter', () => {
        const doc = { url: '/articles/test-example' };
        const output = plugin.getMetadata(doc, '');
        expect(output.url).to.equal(urlFormatter.format(doc.url));
      });
    });

    describe('with a document without a url property', () => {
      it('generates a url using the path and then formats it using the UrlFormatter', () => {
        const doc = { path: '/articles/test-example' };
        const expectedUrl = doc.path.replace(NormalizeUrlsPlugin.defaults.documentPathRegex, '');
        const output = plugin.getMetadata(doc, '');
        expect(output.url).to.equal(urlFormatter.format(expectedUrl));
      });
    });

    describe('with a document with an image property', () => {
      it('formats the image URL using the UrlFormatter', () => {
        const doc = { url: '/articles/test-example', image: '/media/example.png' };
        const output = plugin.getMetadata(doc, '');
        expect(output.image).to.equal(urlFormatter.format(doc.image));
      });
    });

  });

});
