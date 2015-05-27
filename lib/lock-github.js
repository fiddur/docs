/**
 * Module dependencies.
 */

var request = require('request');
var base = 'https://cdn.rawgit.com/auth0/lock/master/';
var cb = require('cb');

var DEFAULT_README = '**[Usage Documentation on GitHub](https://github.com/auth0/lock)**';

function fetch(doc, callback) {

  request(base + doc, cb(function (err, response, body) {
    if (err) {
      if (err && (err.code === 'ENETUNREACH' ||
                  err instanceof cb.TimeoutError)) {
        err = null;
        body = DEFAULT_README;
      } else {
        return callback(err);
      }
    }

    if (response && response.statusCode !== 200) {
      return callback(new Error('There was an error fetching ' + base + doc));
    }

    fetch.cache[doc] = body;
    callback(null, fetch.cache[doc]);

  }).timeout(2000));

}

fetch.cache = {};

module.exports = fetch;
