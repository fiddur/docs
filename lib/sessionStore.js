var nconf = require('nconf');

var store;

if (nconf.get('db')) {
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
