var nconf = require('nconf');

if (!nconf.get('db')) {
  var MemoryStore = require('connect/lib/middleware/session').MemoryStore;
  module.exports = new MemoryStore();
  return;
}

var yams = require('yams');
var getDb = require('./data');

module.exports = function(connect) {
  var Yams  = yams(connect);
  return new Yams(function (callback) {
    getDb(function (db) {
      callback(null, db.collection('sessions'));
    });
  });
};
