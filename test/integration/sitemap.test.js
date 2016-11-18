import { expect } from 'chai';
import { basename, dirname, resolve } from 'path';
import urljoin from 'url-join';
import { parseString as parseXmlString } from 'xml2js';
import { getAppTypes, getPlatformIndexFiles } from '../../lib/pipeline/util';
import { createProductionPipeline } from '../util';

describe('Sitemap Reduction', function() {
  this.timeout(30000);

  const appTypes = getAppTypes();
  const indexes = {};
  appTypes.forEach(appType => {
    indexes[appType.name] = getPlatformIndexFiles(resolve(__dirname, '../../docs/articles', appType.slug));
  });

  let cache;
  let urlFormatter;
  let reduction;
  let baseUrl;

  const isQuickstartDocument = (doc) =>
    appTypes.some(appType => doc.url.indexOf(urljoin(baseUrl, `/${appType.slug}/`) === 0));

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      urlFormatter = pipeline.urlFormatter;
      baseUrl = urlFormatter.baseUrl;
      reduction = pipeline.getReduction('sitemap');
      done();
    });
  });

  it('reduces to an object with urls and xml properties', () => {
    expect(reduction).to.be.an('object');
    expect(reduction.urls).to.be.an('array');
    expect(reduction.xml).to.be.a('string');
  });

  it('formats all urls as absolute urls', () => {
    reduction.urls.forEach(url => {
      expect(/^https?:\/\//.test(url));
    });
  });

  it('adds quickstart urls', () => {
    const { urls } = reduction;
    appTypes.forEach(appType => {
      const baseRoute = urljoin(baseUrl, `quickstart/${appType.name}`);
      expect(urls).to.contain(baseRoute);
      indexes[appType.name].forEach(index => {
        expect(urls).to.contain(urljoin(baseRoute, index.name));
        index.data.articles.forEach(article => {
          expect(urls).to.contain(urljoin(baseRoute, index.name, article));
        });
      });
    });
  });

  it('adds non-quickstart document urls', () => {
    const { urls } = reduction;
    cache.forEach(doc => {
      if (doc.sitemap && !isQuickstartDocument(doc)) {
        expect(urls).to.contain(doc.url);
      }
    });
  });

  it('builds a well-formatted xml sitemap string', (done) => {
    parseXmlString(reduction.xml, (err, data) => {
      expect(err).not.to.exist;
      expect(data.urlset).to.exist;
      expect(data.urlset.url).to.be.an('array');
      data.urlset.url.forEach(item => {
        expect(item.loc).to.be.an('array');
        expect(item.loc).to.have.length(1);
      });
      done();
    });
  });

});
