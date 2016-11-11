import { resolve } from 'path';
import { expect } from 'chai';
import urljoin from 'url-join';
import UrlFormatter from '../../lib/pipeline/UrlFormatter';

describe('UrlFormatter', () => {

  const baseUrl = 'https://tests.local/';
  const mediaUrl = 'https://cdn.cloud/';

  describe('when the constructor is called', () => {
    describe('without a baseUrl option', () => {
      it('throws an Error', () => {
        const func = () => new UrlFormatter({ mediaUrl });
        expect(func).to.throw(/requires a baseUrl option/);
      });
    });
  });

  describe('when format() is called', () => {
    describe('with a falsy url', () => {
      it('returns undefined', () => {
        const formatter = new UrlFormatter({ baseUrl, mediaUrl });
        const result = formatter.format(null);
        expect(result).to.equal(undefined);
      });
    });
    describe('with an absolute url containing a scheme', () => {
      it('returns the url unchanged', () => {
        const formatter = new UrlFormatter({ baseUrl, mediaUrl });
        const url = 'https://anothersite.local/some/path';
        const result = formatter.format(url);
        expect(result).to.equal(url);
      });
    });
    describe('with a protocol-relative absolute url', () => {
      it('returns the url unchanged', () => {
        const formatter = new UrlFormatter({ baseUrl, mediaUrl });
        const url = '//anothersite.local/some/path';
        const result = formatter.format(url);
        expect(result).to.equal(url);
      });
    });
    describe('with a relative url', () => {
      it('prepends the url with the baseUrl', () => {
        const formatter = new UrlFormatter({ baseUrl, mediaUrl });
        const url = '/some/example/article';
        const result = formatter.format(url);
        expect(result).to.equal(urljoin(baseUrl, url));
      });
    });
    describe('with a relative url that begins with /media', () => {
      describe('when a mediaUrl has been set', () => {
        it('replaces /media with the mediaUrl', () => {
          const formatter = new UrlFormatter({ baseUrl, mediaUrl });
          const url = '/media/example/image.jpg';
          const result = formatter.format(url);
          expect(result).to.equal(urljoin(mediaUrl, 'example/image.jpg'));
        });
      });
      describe('when a mediaUrl has not been set', () => {
        it('prepends the url with the baseUrl', () => {
          const formatter = new UrlFormatter({ baseUrl });
          const url = '/media/example/image.jpg';
          const result = formatter.format(url);
          expect(result).to.equal(urljoin(baseUrl, url));
        });
      });
    });
  });

});
