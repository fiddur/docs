import nconf from 'nconf';
import _ from 'lodash';
import express from 'express';
import * as regions from '../regions';
var router = express.Router();

function apiExplorerV1(options, req, res) {
  // the right-most property takes presedence
  var ctx = _.extend(options, res.locals, {
    docsDomain: nconf.get('DOMAIN_URL_DOCS')
  });

  if (options.isAuth /* force read only on mngmt api 1 */
    && res.locals.account.loggedIn && req.user.is_owner) {
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

  res.render(__dirname + '/api-explorer.jade', ctx);
}

router.get('/api/management/v1', apiExplorerV1.bind(this, {title: 'Management API v1 (deprecated)', isAuth: false, anchors: true}));
router.get('/api/authentication', apiExplorerV1.bind(this, {title: 'Authentication API', isAuth: true, anchors: true}));

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

  res.render(__dirname + '/api2-explorer.jade', ctx);
});

export default router;
