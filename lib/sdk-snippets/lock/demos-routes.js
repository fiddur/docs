import getWidgetScriptUrl from './widget-script-url';
import nconf from 'nconf';
import getDb from '../../data';
import express from 'express';
import winston from 'winston';

var router = express.Router();

const WIDGET_FALLBACK_CLIENTID = nconf.get('WIDGET_FALLBACK_CLIENTID');
const DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');
const LOGIN_WIDGET_URL = nconf.get('LOGIN_WIDGET_URL');
const AUTH0JS_URL  = nconf.get('AUTH0JS_URL');
const LOCK_PASSWORDLESS_URL  = nconf.get('LOCK_PASSWORDLESS_URL');
const DEMOS = ['custom', 'embedded', 'link', 'login', 'redirect', 'sms', 'magiclink', 'emailcode'];

DEMOS.forEach(function (demo) {
  router.get('/lock-demos/' + demo, function (req, res, next) {

    var params = {
      clientID: req.query.a || WIDGET_FALLBACK_CLIENTID,
      region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
    };

    getWidgetScriptUrl(params, function (err, assetsUrl, tenant_domain, namespace, client) {
      if (err && process.env.NODE_ENV !== 'production') {
        // This happens on local development
        return res.send('This frame does not render for local development. This is normal.');
      }

      client = client || {
        clientID: WIDGET_FALLBACK_CLIENTID,
        callback: 'http://YOURAPP.com'
      };

      res.locals.widget_url             = LOGIN_WIDGET_URL;
      res.locals.lock_passwordless_url  = LOCK_PASSWORDLESS_URL;
      res.locals.auth0_sdk_assets       = assetsUrl;
      res.locals.tenant_domain          = tenant_domain;
      res.locals.namespace              = namespace;
      res.locals.clientID               = client.clientID;
      res.locals.callback               = client.callback;
      res.locals.docs_route             = DOMAIN_URL_DOCS;
      res.locals.auth0js_url            = AUTH0JS_URL;
      res.locals.callbackOnHash         = req.query.callbackOnHash === 'true';

      if (!nconf.get('db')) {
        res.locals.connections = [];
        return next();
      }
      getDb(function (db) {
        db.collection('connections').find({client_id: client.clientID, status: true}).toArray(function(err, connections) {
          if (err) return res.send(err);

          res.locals.connections = connections;
          next();
        });
      });
    });
  }, function (req, res) {
    res.render(__dirname + '/demos/' + demo);
  });
});

export default router;
