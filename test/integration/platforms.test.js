import { expect } from 'chai';
import { basename, dirname, resolve } from 'path';
import { getAppTypes, getPlatformIndexFiles } from '../../lib/pipeline/util';
import { createProductionPipeline } from '../util';
import { flatten } from 'lodash';
import Tree from '../../lib/pipeline/models/Tree';

describe('Platforms Reduction', function() {
  this.timeout(30000);

  let expectedCount = 0;
  const appTypes = getAppTypes();
  const indexes = {};
  appTypes.forEach(appType => {
    indexes[appType.name] = getPlatformIndexFiles(resolve(__dirname, '../../docs/articles', appType.slug));
    expectedCount += indexes[appType.name].length;
  });

  let cache;
  let urlFormatter;
  let reduction;

  before(done => {
    createProductionPipeline((err, pipeline) => {
      expect(err).not.to.exist;
      cache = pipeline;
      urlFormatter = pipeline.urlFormatter;
      reduction = pipeline.getReduction('platforms');
      done();
    });
  });

  it('reduces to an array', () => {
    expect(reduction).to.be.an('array');
    expect(reduction).to.have.length(expectedCount);
  });

  it('adds an entry for each platform', () => {
    appTypes.forEach(appType => {
      indexes[appType.name].forEach(index => {
        const { name, data } = index;
        const entry = reduction.find(item => item.platform_type === appType.name && item.hash === name);
        expect(entry).to.be.an('object');
        expect(entry.name).to.equal(data.title);
        expect(entry.description).to.equal(data.description);
        expect(entry.url).to.equal(urlFormatter.format(`/quickstart/${appType.name}/${name}`));
        expect(entry.image).to.equal(urlFormatter.format(data.image));
        expect(entry.thirdParty).to.equal(data.thirdParty);
        expect(entry.snippets).to.deep.equal(data.snippets);
        expect(entry.alias).to.deep.equal(data.alias);
      });
    });
  });

  it('sorts the entries alphabetically', () => {
    const names = reduction.map(item => item.name);
    const expectedNames = [].concat(names).sort((a, b) => a.localeCompare(b));
    expect(names).to.deep.equal(expectedNames);
  });

});
