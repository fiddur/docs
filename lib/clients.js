var clients  = module.exports;
var regions  = require('./regions');
var urlJoin = require('url-join');
var request = require('request');


/*
 * params: region, clientID or tenant
 */
clients.find = function (params, callback) {
  if (!params.region) {
    return callback(new Error('missing region parameter'));
  }

  var client = regions.get_client(params.region);

  client.getAccessToken(function (err, accessToken) {
    if (err) return callback(err);
    request.get({
      url:  params.clientID ?
              urlJoin(client.apiUrl, '/clients/', params.clientID) :
              urlJoin(client.apiUrl, '/tenants/' + params.tenant + '/clients'),
      qs: {
        access_token: accessToken,
      },
      json: true
    }, function (err, resp, body) {
      if (resp && resp.statusCode === 200) {
        return callback(null, Array.isArray(body) ? body : [body]);
      }
      return callback(err || new Error(body));
    });
  });
};

/*
 * Get the global client of a given tenant.
 *
 * params: { region, tenant or name  }
 */
clients.getGlobalClient = function(params, callback) {
  var client = regions.get_client(params.region);
  // Only Auth0 tenant can perform this action
  client.getAccessToken(function (err, accessToken) {
    if (err) return callback(err);

    request({
      url:  client.apiUrl + '/' + (params.tenant || params.name) + '/clients/global',
      qs:   { access_token: accessToken },
      json: true
    },
    function (err, resp, body) {
      if (err) return callback(err);
      if (resp.statusCode.toString().substr(0, 1) !== '2') {
        return callback(new Error(body));
      }
      callback(null, body);
    });
  });
};