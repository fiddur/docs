var jade     = require('jade');
var fs       = require('fs');
var nconf    = require('nconf');
var _ = require('lodash');
var tmplPath = __dirname + '/index.jade';
var widget_script_url = require('./widget_script_url');

var tmpl     = jade.compile(fs.readFileSync(tmplPath).toString(), {
  filename: tmplPath,
  pretty: true
});

module.exports = function (req, res, next)  {
  if (process.env.NODE_ENV !== "production") {
    tmpl = jade.compile(fs.readFileSync(tmplPath).toString(), {
      filename: tmplPath,
      pretty: process.env.NODE_ENV !== "production"
    });
  }

  var params = {
    clientID: res.locals.account.clientId ||
      nconf.get('WIDGET_FALLBACK_CLIENTID'),
    region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
  };

  widget_script_url.get(params, function (err, url) {
    var jadelocals = { callbackOnHashMode: false };
    jadelocals.widget_url = url;

    Object.keys(res.locals).forEach(function (k) {
      jadelocals[k] = res.locals[k];
    });

    jadelocals.DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');

    jadelocals.backend = req.query.backend;

    res.locals.lockSDK = tmpl(jadelocals);
    res.locals.lockSDKWithCallbackOnHash = tmpl(_.extend(jadelocals, { callbackOnHashMode: true }));

    next();
  });
};
