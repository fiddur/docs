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
var htmlparser = require('htmlparser2');
var async = require('async');
var testConfig = require('../docs/tests.json');
var urlJoin = require('url-join');

var baseUrl = urlJoin('http://localhost:' + nconf.get('PORT'), nconf.get('BASE_URL'));

var forEachDocPage = function(callback, done) {
  var q = async.queue(function (url, cb) {
    request(baseUrl + url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        callback(null, url, body);
      }
      cb(error);
    });
  }, 10);

  q.push(docUrls);

  q.drain = function() {
    if (done) {
      done();
    }
  };
}

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
        excludeExternalLinks: true,
        checkUniqueUrlOnce: true
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

              //ignore links to HOME
              if (result.url.original === '/') {
                return;
              }

              results.push(result);
              var error = result.base.original + '\t' + result.url.original + '\t' + result.http.statusCode + '\n';
              console.error(error);
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
        urlChecker.enqueue(urlJoin(baseUrl, url));
      });

    });

    it('should not reference blacklisted urls', function(done) {
      this.timeout(0); // This test takes a while to run.

      var parser = new htmlparser.Parser({
          onopentag: function(name, attribs){
            if(name === 'a') {
              testConfig.blacklisted_urls.forEach(function(host) {
                if (attribs.href && attribs.href.indexOf(host) > -1) {
                  assert.fail(attribs.href, null, 'Use of blacklisted URI \"' + attribs.href + '\"');
                }
              });
            } else if (name === 'img') {
              testConfig.blacklisted_urls.forEach(function(host) {
                if (attribs.src && attribs.src.indexOf(host) > -1) {
                  assert.fail(attribs.src, null, 'Use of blacklisted URI \"' + attribs.src + '\"');
                }
              });
            }
          }
      }, {decodeEntities: true});

      forEachDocPage(function(err, body) {
        if (err) { throw err; }
        parser.write(body);
      }, function() {
        parser.end();
        done();
      });
    });

    it('should not contain raw markdown characters', function(done) {
      this.timeout(60000);
      var checkForMarkdownChars = function(url, body) {
        assert(body.indexOf('```') === -1, 'The page at ' + url + ' was not rendered correctly and contains invalid markdown characters.');
      }

      forEachDocPage(function(err, url, body) {
        if (err) { throw err; }
        checkForMarkdownChars(url, body);
      }, done);
    });
  });

  describe('Media', function() {

    it('should not include large media files', function(done) {
      this.timeout(60000); // This test takes a while to run.

      var testDirectory = function(dir) {
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
          var file = path.join(dir, files[i]);
          var stats = fs.statSync(file);
          if (stats.isDirectory()) {
            testDirectory(file);
          } else {
            var maxSize = 512000;

            // TODO: We need to deal with these huge gifs
            if (path.extname(file) === '.gif') {
                maxSize = 5000000;
            }
            assert.equal(stats.size < maxSize, true, 'The image at "' + file.replace(path.join(__dirname, '../docs'), '') + '" is ' + stats.size + ' bytes.');
          }
        }
      }

      testDirectory(path.join(__dirname, '../docs/media'));
      done();
    });
  });
});
