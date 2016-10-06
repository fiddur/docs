import nconf from 'nconf';
import _ from 'lodash';
import path from 'path';
import pug from 'pug';
import express from 'express';
import * as regions from '../regions';
import env from '../env';


const router = express.Router();

router.get('/api/authentication', (req, res, next) => {
  const options = {
    title: 'Authentication API',
    isAuth: true,
    anchors: true,
    docsDomain: nconf.get('DOMAIN_URL_DOCS')
  };

  const ctx = _.extend(res.locals, options);

  if (res.locals.account.loggedIn && req.user.is_owner) {
    ctx.readOnly = false;
    ctx.user = {
      id: req.user.id,
      name: req.user.name,
      mail: req.user.mail
    };

    ctx.globalClientSecret = res.locals.account.globalClientSecret;
    ctx.globalClientID = res.locals.account.globalClientId;
  } else {
    ctx.readOnly = true;
    ctx.user = {
      id: 'john.doe',
      name: 'John Doe',
      mail: 'john@doe.com'
    };

    ctx.globalClientSecret = '';
    ctx.globalClientID = '';
  }

  pug.renderFile(path.join(__dirname, '/authentication-api-explorer.pug'), ctx, (err, html) => {
    if (err) {
      throw err;
    }
    res.locals.staticPage = {
      html,
      pageTitle: 'Test',
      pageDescription: 'Foo'
    };
    next();
  });
});

router.get('/api/management/v2', (req, res, next) => {
  var tenant = req.user && req.user.tenant;
  var region = tenant ? tenant.region : 'default';

  var ctx = _.extend({}, res.locals, {
    title: 'Management API v2',
    sentryDSN: env.SENTRY_DSN_MGMT_EXPLORER,
    bodyClass: 'page-docs',
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

  pug.renderFile(path.join(__dirname, '/management-api-v2-explorer.pug'), ctx, (err, html) => {
    if (err) {
      throw err;
    }
    res.locals.staticPage = {
      html,
      pageTitle: 'Management API v2',
      pageDescription: 'Foo'
    };
    next();
  });
});

export default router;
