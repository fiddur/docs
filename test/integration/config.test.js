import fs from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';
import yaml from 'js-yaml';

describe('Configuration', () => {

  const loadYaml = (filename) => yaml.safeLoad(fs.readFileSync(resolve(filename, '../docs/config', filename), 'utf8'));

  describe('app-types.yml', () => {
    it('is valid YAML in the expected format', () => {
      const data = loadYaml('app-types.yml');
      expect(data).to.be.an('object');
      expect(data.appTypes).to.be.an('array');
      expect(data.appTypes).to.have.length.above(0);
    });
  });

  describe('cards.yml', () => {
    it('is valid YAML in the expected format', () => {
      const data = loadYaml('cards.yml');
      expect(data).to.be.an('array');
      expect(data).to.have.length.above(0);
    });
  });

  describe('sections.yml', () => {
    it('is valid YAML in the expected format', () => {
      const data = loadYaml('sections.yml');
      expect(data).to.be.an('array');
      expect(data).to.have.length.above(0);
    });
  });

  describe('sidebar.yml', () => {
    it('is valid YAML in the expected format', () => {
      const data = loadYaml('sidebar.yml');
      expect(data).to.be.an('object');
      expect(data).to.have.keys('articles', 'apis', 'appliance');
    });
  });

});
