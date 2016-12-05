import _ from 'lodash';
import nconf from 'nconf';
import url from 'url';
import express from 'express';
import crypto from 'crypto';
import request from 'request';
import limitd from '../limitd';
import overrideIfAuthenticated from '../middleware/override-if-authenticated';
import { logger } from '../logs';
import * as regions from '../regions';

const router = express.Router();

const packagerUrl = nconf.get('PACKAGER_URL');

router.use(overrideIfAuthenticated);
// router.use(function(req, res, next) {
//   if (!limitd) return next();
//
//   limitd.take('package creator', req.ip, function(err, resp) {
//     if (err) return next();
//     if (resp && !resp.conformant) {
//       return res.send(429);
//     }
//     next();
//   });
// });

router.use((req, res, next) => {
  // If we are in a test env, we dont want to actually download the package.
  // The exception is if we are testing this endpoint specifically by using the
  // ENABLE_PACKAGE_TEST flag.
  if (process.env.NODE_ENV === 'test' && nconf.get('ENABLE_PACKAGE_TEST')) {
    return res.sendStatus(200);
  }
  return next();
});

// Check to make sure the package is configured (this is mostly for local dev)
router.use((req, res, next) => {
  if (packagerUrl) {
    return next();
  }
  return res.status(501).send('Error: The packager is not configured to run on this server.');
});

router.use((req, res, next) => {
  let options = {};
  if (req.query.client_id && req.query.client_id !== 'YOUR_CLIENT_ID') {
    if (!res.locals.account) {
      return res.status(401)
        .send('Unauthorized: You need to log in to be able to use a specific client.');
    }

    const localClient = _.find(res.locals.account.clients, (client) =>
      client.clientID === req.query.client_id
    );

    if (!localClient) {
      return res.status(401)
        .send('Unauthorized: You can\'t use a client that doesn\'t belong to you.');
    }

    options = {
      client_id: localClient.clientID,
      client_secret: localClient.clientSecret,
      tenant: req.user.tenant.name,
      namespace: regions.get_namespace(req.user.tenant.region)
        .replace('{tenant}', req.user.tenant.name),
      callback_url: localClient.callback
    };
  }

  res.locals.pkgOptions = options;
  return next();
});

router.get('/v2', (req, res) => {
  const pgkUrl = url.resolve(packagerUrl, '/package/v2');

  const options = {
    org: req.query.org,
    repo: req.query.repo,
    branch: req.query.branch,
    path: req.query.path,
    values: {
      CLIENT_ID: res.locals.pkgOptions.client_id || 'YOUR_CLIENT_ID',
      CLIENT_SECRET: res.locals.pkgOptions.client_secret || 'YOUR_CLIENT_SECRET',
      TENANT: res.locals.pkgOptions.tenant || 'YOUR_TENANT',
      DOMAIN: res.locals.pkgOptions.namespace || 'YOUR_DOMAIN',
      CALLBACK_URL: res.locals.callback_url || 'YOUR_CALLBACK_URL',
      MOBILE_CUSTOM_SCHEME: `a0${res.locals.pkgOptions.client_id || 'SCHEME'}`,
      RANDOM_STRING_64: crypto.randomBytes(32).toString('hex')
      // YOU CAN ADD MORE VALUES HERE TO REPLACE IN FILES
    }
  };

  const pgkReq = request.post({ url: pgkUrl, json: options });

  pgkReq.pipe(res);

  pgkReq.on('error', (err) => {
    logger.error('error when fetching package', {
      error: err.stack,
      package_url: pgkUrl,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
    res.status(500).send('Error: Could not download the project.');
  });

  res.on('error', (err) => {
    logger.error('error when fetching package', {
      error: err.stack,
      package_url: pgkUrl,
      url: req.originalUrl,
      tenant: res.locals && res.locals.account && res.locals.account.tenant
    });
  });
});

router.get('/error', (req, res, next) => {
  res.status(500);
  res.render('error', { msg: 'There was an error downloading this sample.' });
});

export default router;
