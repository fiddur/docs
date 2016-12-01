import nconf from 'nconf';

// Default function if we have no DB
var result = function () {
  throw new Error('no db');
};

// If we have DB, setup real function
if (nconf.get('db')) {
  const env = {
    DB: nconf.get('db')
  };
  const getDb = require('auth0-mongodb-config')(env);
  result = getDb;
}

export default result;
