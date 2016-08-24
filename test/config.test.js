var nconf = require('nconf');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');

describe('Configuration', function() {

  describe('app-types.yml', function() {
    it('is valid yml', function() {
      var sidebar = yaml.safeLoad(fs.readFileSync('./config/app-types.yml'));
      assert.ok(sidebar)
    });
  });
  describe('cards.yml', function() {
    it('is valid yml', function() {
      var sidebar = yaml.safeLoad(fs.readFileSync('./config/cards.yml'));
      assert.ok(sidebar)
    });
  });
  describe('sections.yml', function() {
    it('is valid yml', function() {
      var sidebar = yaml.safeLoad(fs.readFileSync('./config/sections.yml'));
      assert.ok(sidebar)
    });
  });
  describe('sidebar.yml', function() {
    it('is valid yml', function() {
      var sidebar = yaml.safeLoad(fs.readFileSync('./config/sidebar.yml'));
      assert.ok(sidebar)
    });
  });
});
