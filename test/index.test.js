/**
 * Module dependencies.
 */

var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var urlJoin = require('url-join');

var baseUrl = urlJoin('http://localhost:' + nconf.get('PORT'), nconf.get('BASE_URL'));

describe('Application', function() {
  after(function (done) {
    docsapp.stop(done);
  });

  before(function (done) {
    docsapp.start(done);
  });

  describe('GET /test', function(){
    it('should respond OK with json', function(done){
      request.get(baseUrl + '/test', function (err, resp) {
        assert.equal(resp.statusCode, 200);
        done();
      });
    });
  });
});
