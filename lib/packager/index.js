var _ = require('lodash');
var nconf = require('nconf');
var url = require('url');
var request = require('request');
var winston = require('winston');
var limitd = require('../limitd');
var overrideIfAuthenticated = require('../middleware/override-if-authenticated');
var express = require('express');
var router = express.Router();

const endpoint = '/:repo/:branch/create-package';
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

// Check to make sure the package is configured (this is mostly for local dev)
router.use(endpoint, function checkEnabled(req, res, next) {
  if (packagerUrl) {
    return next();
  }
  return res.status(501).send('Error: The packager is not configured to run on this server.');
});

router.get(endpoint, function(req, res) {
  if (req.query.clientId) {
    if (!res.locals.account) {
      return res.status(401).send('Unauthorized: You need to log in to be able to use a clientId');
    }

    var localClient = _.find(res.locals.account.clients, function(client) {
      return client.clientID === req.query.clientId;
    });

    if (!localClient) {
      return res.status(401).send('Unauthorized: You can\'t use a clientId that doesn\'t belong to you.');
    }
  }

  var pkg_url = url.resolve(packagerUrl, req.url.substr(nconf.get('BASE_URL').length));

  var pkg_req = request(pkg_url);

  pkg_req.pipe(res);

  pkg_req.on('error', function(err) {
    winston.error('error when fetching package', {
      error: err.stack,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
    res.status(500).send('Error: Could not download the project.');
  });

  res.on('error', function(err) {
    winston.error('error when fetching package', {
      error: err.stack,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
  });

});

export default router;
