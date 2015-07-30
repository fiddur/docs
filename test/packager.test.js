var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var urlJoin = require('url-join');

var baseUrl = urlJoin('http://localhost:' + nconf.get('PORT'), nconf.get('BASE_URL'));

describe('Application', function() {
  after(function(done) {
    docsapp.stop(done);
  });

  describe('Packager', function() {
    it('should return 500 error when downloading android package', function(done) {
      this.timeout(0);
      var packageTestUrl = urlJoin(baseUrl, '/native-mobile-samples/master/create-package?path=Android/basic-sample&type=replace&filePath=Android/basic-sample/app/src/main/res/values/auth0.xml');
      request(packageTestUrl,
        function(error, response, body) {
          assert.equal(response.statusCode, 500);
          assert.equal(body, 'Error: Could not download the project.');
          done();
        });
    });
  });
});
