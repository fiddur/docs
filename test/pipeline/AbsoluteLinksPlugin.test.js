import { expect } from 'chai';
import { resolve } from 'path';
import AbsoluteLinksPlugin from '../../lib/pipeline/plugins/content/AbsoluteLinksPlugin';

describe('AbsoluteLinksPlugin', () => {

  describe('when the constructor is called', () => {
    describe('with no domain option specified', () => {
      it('throws an Error', () => {
        const func = () => new AbsoluteLinksPlugin();
        expect(func).to.throw(/requires a domain option/);
      });
    });
  });

  describe('when transform() is called', () => {

    const plugin = new AbsoluteLinksPlugin({ domain: 'https://test-auth0-docs.com' });

    describe('when the content contains a root-relative href attribute', () => {
      it('prepends it with the domain', () => {
        const content = '<a href="/articles/example" />';
        const transformed = plugin.transform({}, content);
        expect(transformed).to.equal('<a href="https://test-auth0-docs.com/articles/example" />');
      });
    });

    describe('when the content contains a root-relative src attribute', () => {
      it('prepends it with the domain', () => {
        const content = '<img src="/some/path/example.jpg" />';
        const transformed = plugin.transform({}, content);
        expect(transformed).to.equal('<img src="https://test-auth0-docs.com/some/path/example.jpg" />');
      });
    });

  });

});
