import assert from 'assert';
import { resolve } from 'path';
import { parse } from 'url';
import { createSitemap } from 'sitemap';
import urljoin from 'url-join';
import { getPlatformIndexFiles } from '../util';

/**
 * Reduces a Cache into an array containing all document URLs, and a sitemap XML
 * representation of them.
 */
class SitemapReducer {

  /**
   * Creates an instance of SitemapReducer.
   * @param {Object} options - An options hash.
   * @param {Array<Object>} [options.appTypes] - An array of app types for Quickstarts.
   * @param {String} [options.articlesDir] - The base directory for articles.
   * @param {string} [options.baseUrl] - The base URL for the site.
   */
  constructor(options = {}) {
    assert(options.appTypes, 'SitemapReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'SitemapReducer constructor requires an articlesDir option');
    assert(options.baseUrl, 'SitemapReducer constructor requires a baseUrl option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.baseUrl = options.baseUrl;
  }

  /**
   * Given a Cache, returns an object containing an array of document URLs, and a sitemap
   * XML representation of the same.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Object} An object representing the sitemap information.
   */
  reduce(cache) {
    // Add the (normalized) baseUrl.
    const urls = [urljoin(this.baseUrl, '/')];

    // Add quickstart URLs.
    this.appTypes.forEach(appType => {
      const baseRoute = urljoin(this.baseUrl, `quickstart/${appType.name}`);
      urls.push(baseRoute);
      const platforms = getPlatformIndexFiles(resolve(this.articlesDir, appType.slug));
      platforms.forEach(platform => {
        urls.push(urljoin(baseRoute, platform.name));
        platform.data.articles.forEach(article => {
          urls.push(urljoin(baseRoute, platform.name, article));
        });
      });
    });

    const isQuickstartDocument = (doc) => this.appTypes.some(appType =>
      doc.url.indexOf(urljoin(this.baseUrl, `/${appType.slug}/`)) === 0
    );

    // Add all non-quickstart documents.
    cache.forEach(doc => {
      if (doc.sitemap && !isQuickstartDocument(doc)) {
        urls.push(doc.url);
      }
    });

    const { protocol, host } = parse(this.baseUrl);
    const sitemap = createSitemap({
      hostname: `${protocol}//${host}`,
      cacheTime: 1000 * 60 * 10, // 10 minutes
      urls
    });

    return { urls, xml: sitemap.toString() };
  }

}

export default SitemapReducer;
