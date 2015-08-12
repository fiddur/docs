/**
 * Module dependencies.
 */

var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var htmlparser = require('htmlparser2');
var async = require('async');
var testConfig = require('../docs/tests.json');
var ProgressBar = require('progress');

var baseUrl = 'http://localhost:' + nconf.get('PORT');

if (nconf.get('DISABLE_CONTENT_TESTS')) {
  return;
}


var getProgressBar = function(total, message) {
  if (!message) {
    console.log('');
    message = '        running test';
  }
  return new ProgressBar(message + ' [:bar] :percent', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: total
  });
};


var docPages = [];
var loadDocPages = function(cb) {
  var routes = [];
  docsapp.routes.forEach(function(route) {
    if (route.route && route.route.path) {
      routes.push(route.route.path);
    }
  });
  var bar = getProgressBar(routes.length, '    Preloading HTML pages');
  var q = async.queue(function (url, done) {
    console.log(baseUrl + url);
    request(baseUrl + url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        throw error || new Error('Status code: ' + response.statusCode);
      }

      docPages.push({
        url: url,
        body: body
      });
      bar.tick();
      done();
    });
  }, 10);

  q.push(routes);

  q.drain = function() {
    console.log('');
    cb();
  };
};

describe('Content', function() {
  after(function (done) {
    docsapp.stop(done);
  });

  before(function (done) {
    this.timeout(180000);
    docsapp.start(function() {
      loadDocPages(done);
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

    it('should not reference blacklisted urls', function(done) {
      this.timeout(5000);

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

      docPages.forEach(function(page) {
        parser.write(page.body);
      });
      done();
    });

    it('should not contain raw markdown characters', function() {
      docPages.forEach(function(page) {
        assert(page.body.indexOf('```') === -1, 'The page at ' + page.url + ' was not rendered correctly and contains invalid markdown characters.');
      });
    });
  });

  describe('Media', function() {

    it('should not include large media files', function(done) {
      this.timeout(300000); // This test takes a while to run.

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
      };

      testDirectory(path.join(__dirname, '../docs/media'));
      done();
    });
  });
});
