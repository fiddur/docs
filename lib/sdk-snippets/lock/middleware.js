import jade from 'jade';
import fs from 'fs';
import nconf from 'nconf';
import getWidgetScriptUrl from './widget-script-url';

const indexTmplPath = __dirname + '/index.jade';
const browserTemlPath = __dirname + '/browser.jade';

function getMiddleware(tmplPath, local) {
  var tmpl = jade.compile(fs.readFileSync(tmplPath).toString(), {
    filename: tmplPath,
    pretty: process.env.NODE_ENV !== 'production' || true
  });

  return function (req, res, next)  {
    var params = {
      clientID: res.locals.account.clientId || nconf.get('WIDGET_FALLBACK_CLIENTID'),
      region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
    };

    getWidgetScriptUrl(params, function (err, url) {
      var jadelocals = { callbackOnHashMode: false };
      jadelocals.widget_url = url;
      jadelocals.widget_client_id = params.clientID;
      jadelocals.loaded_on_dashboard = req.query.internal !== 'true';
      jadelocals.widget_backend = req.query.backend;

      Object.keys(res.locals).forEach(function (k) {
        jadelocals[k] = res.locals[k];
      });

      jadelocals.DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');

      res.locals[local] = tmpl(jadelocals);
      //res.locals.lockSDKWithCallbackOnHash = tmpl(_.extend(jadelocals, { callbackOnHashMode: true }));

      next();
    });
  };
}

export var index = getMiddleware(indexTmplPath, 'lockSDK');
export var browser = getMiddleware(browserTemlPath, 'browser');
