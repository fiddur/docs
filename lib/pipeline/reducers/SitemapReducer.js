import assert from 'assert';
import { resolve } from 'path';
import { parse } from 'url';
import { createSitemap } from 'sitemap';
import urljoin from 'url-join';
import { getPlatformIndexFiles } from '../util';

class SitemapReducer {

  constructor(options = {}) {
    assert(options.appTypes, 'QuickstartsReducer constructor requires an appTypes option');
    assert(options.articlesDir, 'QuickstartsReducer constructor requires an articlesDir option');
    assert(options.baseUrl, 'QuickstartsReducer constructor requires a baseUrl option');
    this.appTypes = options.appTypes;
    this.articlesDir = options.articlesDir;
    this.baseUrl = options.baseUrl;
  }

  reduce(cache) {
    const urls = ['/docs'];

    // Add quickstart URLs.
    this.appTypes.forEach(appType => {
      const baseRoute = `/docs/quickstart/${appType.name}`;
      urls.push(baseRoute);
      const platforms = getPlatformIndexFiles(resolve(this.articlesDir, appType.slug));
      platforms.forEach(platform => {
        urls.push(urljoin(baseRoute, platform.name));
        platform.data.articles.forEach(article => {
          urls.push(urljoin(baseRoute, platform.name, article));
        });
      });
    });

    // Add all non-quickstart documents.
    cache.forEach(doc => {
      const isQuickstart = this.appTypes.some(appType =>
        doc.url.indexOf(`/${appType.slug}/`) === 0
      );
      if (doc.sitemap && !isQuickstart) {
        urls.push(urljoin('/docs', doc.url));
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
