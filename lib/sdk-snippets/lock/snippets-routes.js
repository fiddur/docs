import ejs from 'ejs';
import { readdirSync as readdir, readFileSync as read } from 'fs';
import defaultCallback from '../../default-callback';
import getWidgetScriptUrl from './widget-script-url';
import express from 'express';
import winston from 'winston';
import nconf from 'nconf';

var router = express.Router();

const snippetsPath = __dirname + '/snippets/';
const DEMOS = ['custom', 'embedded', 'link', 'login', 'redirect', 'sms', 'magiclink', 'emailcode'];
const LOCK_10_URL = nconf.get('LOCK_10_URL');
const AUTH0JS_URL  = nconf.get('AUTH0JS_URL');
const LOCK_PASSWORDLESS_URL  = nconf.get('LOCK_PASSWORDLESS_URL');

var snippets_templates = readdir(snippetsPath).map(function (fi) {
  return {
    id:   fi.replace(/\.html$/, ''),
    tmpl: ejs.compile(read(__dirname + '/snippets/' + fi, { encoding: 'utf8' }))
  };
});

function include_snippet (locals) {
  return function ( snippet_id ) {
    return snippets_templates.filter(function (sn) {
      return sn.id === snippet_id;
    })[0].tmpl(locals);
  };
}

DEMOS.forEach(function (snippet) {
  router.get('/lock-snippets/' + snippet, function (req, res) {
    var params = {
      clientID: res.locals.account.clientId,
      region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
    };

    getWidgetScriptUrl(params, function (err, assetsUrl, tenant_domain, namespace, client) {
      client = client || {
        clientID: params.clientID
      };

      var jadelocals = {
        widget_url:     LOCK_10_URL,
        lock_passwordless_url: LOCK_PASSWORDLESS_URL,
        auth0js_url:    AUTH0JS_URL,
        callbackOnHash: req.query.callbackOnHash === 'true',
        account: {
          namespace:  namespace || res.locals.account.namespace,
          clientId:   client.clientID,
          callback:   client.callback || defaultCallback(req)
        },
        assetsUrl: assetsUrl
      };

      res.locals.include_snippet = include_snippet(jadelocals);
      res.render(snippetsPath + snippet);
    });
  });
});

export default router;
