import nconf from 'nconf';
import _ from 'lodash';
import express from 'express';
import * as regions from '../regions';
var router = express.Router();

router.get('/api/authentication', (req, res) => {

  var options = {
    title: 'Authentication API',
    isAuth: true,
    anchors: true,
    docsDomain: nconf.get('DOMAIN_URL_DOCS')
  }

  var ctx = _.extend(res.locals, options);

  if (res.locals.account.loggedIn && req.user.is_owner) {
    ctx.readOnly = false;
    ctx.user = {
      id: req.user.id,
      name: req.user.name,
      mail: req.user.mail
    };

    ctx.globalClientSecret = res.locals.account.globalClientSecret;
    ctx.globalClientID = res.locals.account.globalClientId;
  }

  res.render(__dirname + '/authentication-api-explorer.jade', ctx);
});

router.get('/api/management/v1', (req, res) => {
  res.render(__dirname + '/management-api-v1-explorer.jade', {title : 'Management API v1 (Deprecated)'});
})

router.get('/api/management/v2', (req, res) => {
  var tenant = req.user && req.user.tenant;
  var region = tenant ? tenant.region : 'default';

  var ctx = _.extend({}, res.locals, {
    title: 'Management API v2',
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

  res.render(__dirname + '/management-api-v2-explorer.jade', ctx);
});

export default router;
