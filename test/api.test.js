var docsapp = require('../start');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var urlJoin = require('url-join');

var baseUrl = urlJoin('http://localhost:' + nconf.get('PORT'), '/docs');

function testApi(path, callback) {
  var testUrl = urlJoin(baseUrl, 'meta', path);
  request(testUrl,
    function(error, response, body) {
      if (error) {
        return callback(error);
      }
      assert.notEqual(body.length, 0);
      assert.equal(response.statusCode, 200);
      callback();
    });
}

describe('API', function() {
  this.timeout(30000);
  after(function(done) {
    docsapp.stop(done);
  });
  before(function(done) {
    docsapp.start(done);
  });

  it('should load snippets', testApi.bind(undefined, 'snippets'));
  it('should load platforms', testApi.bind(undefined, 'platforms'));
  it('should load quickstart', testApi.bind(undefined, 'quickstart'));
  it('should load articles', testApi.bind(undefined, 'articles'));
});
