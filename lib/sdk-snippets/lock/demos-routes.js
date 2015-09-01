import getWidgetScriptUrl from './widget-script-url';
import nconf from 'nconf';
import getDb from '../../data';
import express from 'express';

var router = express.Router();

const WIDGET_FALLBACK_CLIENTID = nconf.get('WIDGET_FALLBACK_CLIENTID');
const DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');

['custom', 'embedded', 'link', 'login', 'redirect'].forEach(function (demo) {
  router.get('/lock-demos/' + demo, function (req, res, next) {

    var params = {
      clientID: req.query.a || WIDGET_FALLBACK_CLIENTID,
      region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
    };

    getWidgetScriptUrl(params, function (err, widgetUrl, assetsUrl, tenant_domain, namespace, client, auth0jsUrl) {
      if (err) return res.send(err);

      client = client || {
        clientID: WIDGET_FALLBACK_CLIENTID,
        callback: 'http://YOURAPP.com'
      };

      res.locals.widget_url       = widgetUrl;
      res.locals.auth0_sdk_assets = assetsUrl;
      res.locals.tenant_domain    = tenant_domain;
      res.locals.namespace        = namespace;
      res.locals.clientID         = client.clientID;
      res.locals.callback         = client.callback;
      res.locals.docs_route       = DOMAIN_URL_DOCS;
      res.locals.auth0js_url      = auth0jsUrl;
      res.locals.callbackOnHash   = req.query.callbackOnHash === 'true';

      if (!nconf.get('db')) {
        res.locals.connections = [];
        next();
      } else {
        getDb(function (db) {
          db.collection('connections').find({client_id: client.clientID, status: true}).toArray(function(err, connections) {
            if (err) return res.send(err);

            res.locals.connections = connections;
            next();
          });
        });
      }
    });
  }, function (req, res) {
    res.render(__dirname + '/demos/' + demo);
  });
});

export default router;
