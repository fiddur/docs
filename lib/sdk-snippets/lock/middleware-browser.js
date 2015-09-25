import jade from 'jade';
import fs from 'fs';
import nconf from 'nconf';
import getWidgetScriptUrl from './widget-script-url';

const tmplPath = __dirname + '/browser.jade';

var tmpl = jade.compile(fs.readFileSync(tmplPath).toString(), {
  filename: tmplPath,
  pretty: process.env.NODE_ENV !== 'production' || true
});

export default function (req, res, next)  {
  var params = {
    clientID: res.locals.account.clientId || nconf.get('WIDGET_FALLBACK_CLIENTID'),
    region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
  };

  getWidgetScriptUrl(params, function (err, url) {
    var jadelocals = { callbackOnHashMode: false };
    jadelocals.widget_url = url;

    Object.keys(res.locals).forEach(function (k) {
      jadelocals[k] = res.locals[k];
    });

    jadelocals.DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');

    res.locals.browser = tmpl(jadelocals);

    next();
  });
}
