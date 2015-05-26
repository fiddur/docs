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
var htmlparser = require("htmlparser2");
var async = require('async');
var testConfig = require('./tests.json');

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
    var linksErrorPath = path.join(__dirname, '../links.error.log');
    var linksRedirectsPath = path.join(__dirname, '../links.redirect.log');
    before(function(done) {
      var deleteFile = function(filePath) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Deleted links log file: ' + filePath);
        }
      };
      deleteFile(linksErrorPath);
      deleteFile(linksRedirectsPath);
      done();
    });

    it('should not include broken links', function(done) {
      this.timeout(0); // This test takes a while to run.

      var options = {
        maxSocketsPerHost: 5,
        excludedSchemes: ['data','geo','mailto','sms','tel','javascript'],
        excludeExternalLinks: true
      };

      var results = [];
      var redirects = [];
      var urlChecker = new blc.HtmlUrlChecker(options, {
          link: function(result){
            if (result.broken) {

              // Ignore the create-package urls, they don't work on localhost
              if (result.url.original.indexOf('create-package') > -1) {
                return;
              }


              results.push(result);
              var data = result.base.original + '\t' + result.url.original + '\t' + result.http.statusCode + '\n';
              fs.appendFile(linksErrorPath, data, function (err) {
                if (err) throw err;
              });
            } else if (result.url.redirected) {
              var data = result.url.original + ' => ' + result.url.redirected.replace(baseUrl, '') + '\n';
              if (redirects.indexOf(data) < 0) {
                redirects.push(data);
                fs.appendFile(linksRedirectsPath, data, function (err) {
                  if (err) throw err;
                });
              }
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

    });

    it('should not reference blacklisted urls', function(done) {
      this.timeout(0); // This test takes a while to run.

      var parser = new htmlparser.Parser({
          onopentag: function(name, attribs){
            if(name === 'a') {
              testConfig.blacklisted_hosts.forEach(function(host) {
                if (attribs.href.indexOf(host) > -1) {
                  assert.fail(attribs.href, null, 'Use of blacklisted URI \"' + attribs.href + '\"');
                }
              });
            }
          }
      }, {decodeEntities: true});

      var q = async.queue(function (url, callback) {
        request(baseUrl + url, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            parser.write(body);
            callback();
          } else {
            callback(error);
          }
        });
      }, 10);

      q.push(docUrls);

      q.drain = function() {
        parser.end();
        done();
      };
    });

  });

});
