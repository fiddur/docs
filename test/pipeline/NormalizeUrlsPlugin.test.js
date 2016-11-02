import { expect } from 'chai';
import { resolve } from 'path';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';
import NormalizeUrlsPlugin from '../../lib/pipeline/plugins/content/NormalizeUrlsPlugin';

describe('NormalizeUrlsPlugin', () => {

  const baseUrl = 'https://tests.local/';
  const mediaUrl = 'https://cdn.cloud/';

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

  describe('when transform() is called', () => {

    const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });
    const plugin = new NormalizeUrlsPlugin({ urlFormatter });

    describe('when the content contains a tag with a src attribute', () => {
      it('replaces its value with a URL formatted using the UrlFormatter', () => {
        const content = imageTag('/media/example.jpg');
        const transformed = plugin.transform({}, content);
        expect(transformed).to.equal(imageTag(urlFormatter.format('/media/example.jpg')));
      });
    });

    describe('when the content contains a tag with an href attribute', () => {
      it('replaces its value with a URL formatted using the UrlFormatter', () => {
        const content = anchorTag('/some/example/article');
        const transformed = plugin.transform({}, content);
        expect(transformed).to.equal(anchorTag(urlFormatter.format('/some/example/article')));
      });
    });

  });

});
