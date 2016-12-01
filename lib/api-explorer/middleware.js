import nconf from 'nconf';
import _ from 'lodash';
import path from 'path';
import pug from 'pug';
import express from 'express';
import * as regions from '../regions';
import env from '../env';

const router = express.Router();

router.get('/api/management/v2', (req, res, next) => {
  var tenant = req.user && req.user.tenant;
  var region = tenant ? tenant.region : 'default';

  var ctx = _.extend({}, res.locals, {
    sentryDSN: env.SENTRY_DSN_MGMT_EXPLORER,
    api2Domain: regions
      .get_namespace(region)
      .replace('{tenant}',
        tenant && tenant.name ? tenant.name : 'login')
  });

  if (res.locals.account.loggedIn && req.user.is_owner) {
    ctx.globalClientSecret = res.locals.account.globalClientSecret;
    ctx.globalClientID = res.locals.account.globalClientId;
  } else {
    ctx.globalClientSecret = '';
    ctx.globalClientID = '';
  }

  pug.renderFile(path.join(__dirname, '/management-api-v2.pug'), ctx, (err, html) => {
    if (err) {
      throw err;
    }
    const meta = {
      title: 'Auth0 Management API v2',
      description: ''
    };

    res.locals.staticPage = { html, meta };
    res.locals.fullWidth = true;

    next();
  });
});

export default router;
