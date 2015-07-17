var nconf = require('nconf');

var store;

if (!nconf.get('db')) {
  var MemoryStore = require('connect/lib/middleware/session').MemoryStore;
  store = new MemoryStore();
} else {
  var yams = require('yams');
  var getDb = require('./data');

  store = function(connect) {
    var Yams  = yams(connect);
    return new Yams(function (callback) {
      getDb(function (db) {
        callback(null, db.collection('sessions'));
      });
    });
  };
}

export default store;
