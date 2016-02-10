import request from 'request';
import async from 'async';
import * as regions from './regions';
import winston from 'winston';
import getDb from './data';
import * as clients from './clients';

function getRegionsAndTenants(user_id, callback) {

  function fetch_node(auth0Client, region, done) {

    auth0Client.getAccessToken(function(err, accessToken) {
      if (err) return callback(err);
      request.get({
        url: auth0Client.apiUrl + '/tenants',
        qs: {
          owner: regions.map_user(region.name, user_id),
          access_token: accessToken
        },
        json: true
      }, function(err, resp, body) {
        if (resp.statusCode === 200) {
          return done(null, body);
        }
        return done(err || new Error(body));
      });
    });
  }


  async.map(regions.name_list, function(region, callback) {
    var client = regions.get_client(region.name);
    fetch_node(client, region, function(err, tenants) {
      if (err || !tenants) {
        tenants = [];
      }
      callback(null, {
        name: region.name,
        description: region.description,
        tenants: tenants
      });
    });
  }, function(err, results) {
    if (err) {
      winston.info('get user tenants error: ' + err.message);
      return callback(err);
    }

    results = results.filter(function(r) {
      return r.tenants.length > 0;
    });

    callback(null, results);
  });

}

function get_tenant_users_from_client(params, client, callback) {
  var owners = (client.owners || [])
    .map(function(owner) {
      return params.region !== 'default' ?
        owner.replace(/^mr\|/, '') :
        owner;
    });

  getDb(function(db) {
    db.collection('tenantUsers')
      .find({
        id: {
          $in: owners
        }
      })
      .toArray(callback);
  });
}

/*
 * Return the owners of the global client.
 * params: region, tenant
 */
function getTenantOwners(params, callback) {
  clients.getGlobalClient(params, function(err, client) {
    if (err) return callback(err);
    get_tenant_users_from_client(params, client, callback);
  });
}

export {
  getRegionsAndTenants,
  getTenantOwners
};