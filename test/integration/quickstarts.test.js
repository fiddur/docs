import { expect } from 'chai';
import { dirname, resolve } from 'path';
import urljoin from 'url-join';
import { createProductionPipeline } from '../util';
import { getAppTypes, findMetadataFiles } from '../../lib/pipeline/util';
import Document from '../../lib/pipeline/models/Document';

describe('Quickstarts Reduction', function() {
  this.timeout(30000);

  const appTypes = getAppTypes();
  const indexes = {};
  appTypes.forEach(appType => {
    indexes[appType.name] = findMetadataFiles(resolve(__dirname, '../../docs/articles/quickstart', appType.name), 'index.yml');
  });

  let cache;
  let reduction;

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      reduction = pipeline.getReduction('quickstarts');
      done();
    });
  });

  it('reduces to an object', () => {
    expect(reduction).to.be.an('object');
  });

  it('adds an entry for each appType', () => {
    appTypes.forEach(appType => {
      const entry = reduction[appType.name];
      expect(entry).to.be.an('object');
    });
  });

  it('merges appType metadata into each entry', () => {
    appTypes.forEach(appType => {
      const entry = reduction[appType.name];
      Object.keys(appType).forEach(key => {
        expect(entry[key]).to.deep.equal(appType[key]);
      });
    });
  });

  it('adds a hash of platforms for each appType', () => {
    appTypes.forEach(appType => {
      const entry = reduction[appType.name];
      expect(entry.platforms).to.be.an('object');
    });
  });

  it('adds platform entries for each index file', () => {
    appTypes.forEach(appType => {
      const { platforms } = reduction[appType.name];
      indexes[appType.name].forEach(index => {
        const platform = platforms[index.name];
        expect(platform).to.be.an('object', `Expected an entry for platform ${index.name}, but none was found`);
        expect(platform.name).to.equal(index.name);
        expect(platform.title).to.equal(index.data.title);
        expect(platform.url).to.equal(`/docs/quickstart/${appType.name}/${platform.name}`);
        expect(platform.third_party).to.equal(index.data.thirdParty);
      });
    });
  });

  it('adds article entries to each platform', () => {
    appTypes.forEach(appType => {
      const { platforms } = reduction[appType.name];
      indexes[appType.name].forEach(index => {
        const platform = platforms[index.name];
        const articleNames = index.data.articles;
        expect(articleNames).to.be.an('array');
        expect(platform.articles).to.be.an('array');
        expect(platform.articles).to.have.length(articleNames.length);
        articleNames.forEach((name, pos) => {
          const article = platform.articles[pos];
          const filename = resolve(dirname(index.filename), `${name}.md`);
          const doc = cache.getByFilename(filename);
          expect(doc).to.be.an.instanceof(Document);
          expect(article.name).to.equal(name);
          expect(article.number).to.equal(pos + 1);
          expect(article.title).to.equal(doc.title);
          expect(article.description).to.equal(doc.description);
          expect(article.budicon).to.equal(doc.budicon);
          expect(article.url).to.equal(urljoin(platform.url, name));
        });
      });
    });
  });

  it('adds default article entries to each platform when one is set', () => {
    appTypes.forEach(appType => {
      const { platforms } = reduction[appType.name];
      indexes[appType.name].forEach(index => {
        const platform = platforms[index.name];
        const name = index.data.default_article;
        if (name) {
          const article = platform.defaultArticle;
          const filename = resolve(dirname(index.filename), `${name}.md`);
          const doc = cache.getByFilename(filename);
          expect(article.name).to.equal(name);
          expect(article.title).to.equal(doc.title);
          expect(article.description).to.equal(doc.description);
          expect(article.budicon).to.equal(doc.budicon);
          expect(article.url).to.equal(urljoin(platform.url, name));
        }
      });
    });
  });

});
