/**
 * Module dependencies.
 */

var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var blc = require('broken-link-checker');
var docUrls = require('../lib/doc-urls');
var fs = require('fs');
var path = require('path');

var baseUrl = 'http://localhost:' + nconf.get('PORT');

describe('Application', function() {
  after(function (done) {
    docsapp.stop(done);
  });

  describe('GET /test', function(){
    it('should respond OK with json', function(done){

      console.log(nconf.get('BASE_URL'));

      request.get(baseUrl + '/test', function (err, resp, body) {
        assert.equal(resp.statusCode, 200);
        done();
      });
    });
  });

  describe('HTML', function() {
    var linksLogPath = path.join(__dirname, 'links.log');
    before(function(done) {
      fs.exists(linksLogPath, function(exists) {
        if (exists) {
          fs.unlink(linksLogPath, function (err) {
            if (err) throw err;
            console.log('Deleted links log file.');
            done();
          });
        } else {
          done();
        }
      });
    });

    it('should not include broken links', function(done) {
      this.timeout(0); // This test takes a while to run.

      var options = {
        maxSocketsPerHost: 5,
        excludedSchemes: ['data','geo','mailto','sms','tel','javascript'],
        excludeExternalLinks: true
      };

      var results = [];
      var urlChecker = new blc.HtmlUrlChecker(options, {
          link: function(result){
            if (result.broken) {

              // Ignore the create-package urls, they don't work on localhost
              if (result.url.original.indexOf('create-package') > -1) {
                return;
              }


              results.push(result);
              var data = result.base.original + '\t' + result.url.original + '\t' + result.http.statusCode + '\n';
              fs.appendFile(linksLogPath, data, function (err) {
                if (err) throw err;
              });
            }
          },
          item: function(error, htmlUrl){
            if (error) {
              throw error;
            }
          },
          end: function(){
            assert.equal(results.length, 0);
            done();
          }
      });


      docUrls.forEach(function(url) {
        urlChecker.enqueue(baseUrl + url);
      });

    })
  });

});
