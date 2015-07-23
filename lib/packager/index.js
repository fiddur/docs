var _        = require('lodash');
var nconf    = require('nconf');
var url      = require('url');
var request  = require('request');
var winston = require('winston');
var limitd = require('../limitd');

module.exports = function (app, authenticatedVarsMiddleware) {
  if (nconf.get('PACKAGER_URL')) {
    app.get(nconf.get('BASE_URL') + '/:repo/:branch/create-package',
      function (req, res, next) {
        limitd.take('package creator', req.ip, function (err, resp) {
          if (err) return next();
          if (resp && !resp.conformant) {
            return res.send(429);
          }
          next();
        });
      },
      authenticatedVarsMiddleware,
      function(req, res) {
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
      var pkg_url = url.resolve(nconf.get('PACKAGER_URL'), req.url.substr(nconf.get('BASE_URL').length));

      var pkg_req = request(pkg_url);

      pkg_req.pipe(res);

      pkg_req.on('error', function (err) {
            winston.error('error when fetching package', {
              error:  err.stack,
              url:    req.originalUrl,
              tenant: res.locals && res.locals.account && res.locals.account.tenant
            });
            res.sendStatus(500);
          });

      res.on('error', function (err) {
        winston.error('error when fetching package', {
          error:  err.stack,
          url:    req.originalUrl,
          tenant: res.locals && res.locals.account && res.locals.account.tenant
        });
      });

    });
  }

};
