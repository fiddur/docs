require('babel/register');
var assert = require('assert');
var lsr = require('lsr');
var path = require('path');
var Doc = require('../lib/docs/doc');


var docsPath = path.resolve(__dirname, '../docs/articles');


describe('Docs', function() {

  describe('compiler', function() {

    it('should compile all docs', function(done) {
      this.timeout(10000); // This test takes a while to run.

      lsr
        .sync(docsPath)
        .forEach(function(fileStat) {
          var filename = fileStat.path;
          if (!/\.md$/.test(filename)) return;
          new Doc(docsPath, filename);
        });
      done();
    });

  });

});
