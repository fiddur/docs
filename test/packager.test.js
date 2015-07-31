var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var urlJoin = require('url-join');

var baseUrl = urlJoin('http://localhost:' + nconf.get('PORT'), nconf.get('BASE_URL'));

describe('Application', function() {
  after(function(done) {
    nconf.set('ENABLE_PACKAGE_TEST', false);
    docsapp.stop(done);
  });
  before(function(done) {
    nconf.set('ENABLE_PACKAGE_TEST', true);
    docsapp.start(done);
  });

  describe('Packager', function() {
    it('should download seed project', function(done) {
      this.timeout(30000);
      var packageTestUrl = urlJoin(baseUrl, '/native-mobile-samples/master/create-package?path=Android/basic-sample&type=replace&filePath=Android/basic-sample/app/src/main/res/values/auth0.xml');
      request(packageTestUrl,
        function(error, response, body) {
          assert.notEqual(body.length, 0);
          assert.equal(response.statusCode, 200);
          done();
        });
    });
  });
});
