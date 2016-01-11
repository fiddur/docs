import nconf   from 'nconf';
import getDb   from 'mongo-getdb';
import url     from 'url';
import winston from 'winston';
import MongoHeartbeat from 'mongo-heartbeat';

// Default function if we have no DB
var result = function () {
  throw new Error('no db');
};

// If we have DB, setup real function
if (nconf.get('db')) {
  var db_url  = nconf.get('db');
  var repl_set_name = url.parse(db_url, true).query.replicaSet;

  var options = {};

  var socketOptions = {
    connectTimeoutMS: 2000,
    keepAlive: 300
  };

  options.server = {
    auto_reconnect: true,
    socketOptions: socketOptions
  };

  if (repl_set_name) {
    options.replSet = {
      rs_name: repl_set_name,
      socketOptions: socketOptions
    };
    db_url = db_url.slice(0, url.parse(db_url, true).search.length * -1);
  }

  getDb.init(db_url, options);

  result = getDb;

  getDb(function(db) {
    var hb = new MongoHeartbeat(db, {
      interval: 10000,
      timeout:   2000
    });
    hb.on('error', function () {
      winston.error('cant connect to the database (mongo-heartbeat)');
      setTimeout(function () {
        process.exit(1);
      }, 2000);
    });
  });
}

export default result;
