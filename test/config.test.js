var nconf = require('nconf');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');

var docsPath = nconf.get('DOCS_PATH') || path.resolve(__dirname, '../docs/articles');
var navigation = yaml.safeLoad(fs.readFileSync(path.join(docsPath, '../config/navigation.yml')));

describe('Configuration', function() {
  describe('Navigation.yml', function() {
    it('Has valid attributes for How To', function() {
      var category = _.find(navigation.categories, { id: 'how-to'});
      assert.notEqual(category.name.length, 0, 'Invalid category name.');
      assert.notEqual(category.description.length, 0, 'Invalid category description');
      assert.ok(category.links.length > 9, 'Not enough how-tos specified.');
      for (var i = 0; i < category.links.length; i++) {
        var link = category.links[i];
        assert.notEqual(link.name.length, 0, 'Invalid link name.');
        assert.notEqual(link.icon.length, 0, 'Invalid link icon.');
        assert.notEqual(link.href.length, 0, 'Invalid link href.');
        assert.notEqual(link.description.length, 0, 'Invalid link description.');
      }
    });
  });
});
