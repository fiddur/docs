var _ = require('lodash');
var nconf = require('nconf');
var url = require('url');
var request = require('request');
var winston = require('winston');
var limitd = require('../limitd');
var overrideIfAuthenticated = require('../middleware/override-if-authenticated');
var express = require('express');
var router = express.Router();
import * as regions from '../regions';

const endpoint = '/package/:repo/:branch';
const packagerUrl = nconf.get('PACKAGER_URL');

router.use(endpoint, overrideIfAuthenticated);
router.use(endpoint, function(req, res, next) {
  if (!limitd) return next();

  limitd.take('package creator', req.ip, function(err, resp) {
    if (err) return next();
    if (resp && !resp.conformant) {
      return res.send(429);
    }
    next();
  });
});

router.use(endpoint, function(req, res, next) {
  // If we are in a test env, we dont want to actually download the package.
  // The exception is if we are testing this endpoint specifically by using the
  // ENABLE_PACKAGE_TEST flag.
  if (process.env.NODE_ENV === 'test' && nconf.get('ENABLE_PACKAGE_TEST')) {
    return res.sendStatus(200);
  } else {
    next();
  }
});

// Check to make sure the package is configured (this is mostly for local dev)
router.use(endpoint, function checkEnabled(req, res, next) {
  if (packagerUrl) {
    return next();
  }
  return res.status(501).send('Error: The packager is not configured to run on this server.');
});

router.get(endpoint, function(req, res) {

  var options = {};
  if (req.query.client_id) {
    if (!res.locals.account) {
      return res.status(401).send('Unauthorized: You need to log in to be able to use a specific client.');
    }

    var localClient = _.find(res.locals.account.clients, function(client) {
      return client.clientID === req.query.client_id;
    });

    if (!localClient) {
      return res.status(401).send('Unauthorized: You can\'t use a client that doesn\'t belong to you.');
    }

    options = {
      client_id: localClient.clientID,
      client_secret: localClient.clientSecret,
      tenant: req.user.tenant.name,
      namespace: regions.get_namespace(req.user.tenant.region).replace('{tenant}', req.user.tenant.name),
      callback_ulr: localClient.callback
    };
  }

  var pkg_url = url.resolve(packagerUrl, req.url);

  var pkg_req = request.post({ url: pkg_url, json: options });

  pkg_req.pipe(res);

  pkg_req.on('error', function(err) {
    winston.error('error when fetching package', {
      error: err.stack,
      package_url: pkg_url,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
    res.status(500).send('Error: Could not download the project.');
  });

  res.on('error', function(err) {
    winston.error('error when fetching package', {
      error: err.stack,
      package_url: pkg_url,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
  });

});

export default router;
