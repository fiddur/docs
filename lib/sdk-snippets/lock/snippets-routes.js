var ejs      = require('ejs');
var fs       = require('fs');
var nconf    = require('nconf');
var defaultCallback = require('../../default-callback');
var snippetsPath = __dirname + '/snippets/';
var readdir = fs.readdirSync;
var read = fs.readFileSync;


var widget_script_url = require('./widget_script_url');

var snippets_templates = readdir(snippetsPath)
  .map(function (fi) {
    return {
      id:   fi.replace(/\.html$/, ''),
      tmpl: ejs.compile(read(__dirname + '/snippets/' + fi, { encoding: 'utf8' }))
    };
  });

var WIDGET_FALLBACK_CLIENTID = nconf.get('WIDGET_FALLBACK_CLIENTID');

function include_snippet (locals) {
  return function ( snippet_id ) {
    return snippets_templates.filter(function (sn) {
      return sn.id == snippet_id;
    })[0].tmpl(locals);
  };
}

module.exports = function (app) {
  ['custom', 'embedded', 'link', 'login', 'redirect'].forEach(function (snippet) {
    app.get(nconf.get('BASE_URL') + '/lock-snippets/' + snippet, function (req, res) {
      var params = {
        clientID: req.query.a || WIDGET_FALLBACK_CLIENTID,
        region: req.user && req.user.tenant ? req.user.tenant.region : 'default'
      };

      widget_script_url.get(params, function (err, widgetUrl, assetsUrl, tenant_domain, namespace, client, auth0jsUrl) {

        client = client || {
          clientID: WIDGET_FALLBACK_CLIENTID
        };

        var jadelocals = {
          widget_url:     widgetUrl,
          auth0js_url:    auth0jsUrl,
          callbackOnHash: req.query.callbackOnHash === 'true',
          account: {
            namespace:  namespace,
            clientId:   client.clientID,
            callback:   client.callback || defaultCallback(req)
          },
          assetsUrl: assetsUrl
        };

        res.locals.include_snippet = include_snippet(jadelocals);
        res.locals.env = {
          BASE_URL: nconf.get('BASE_URL')
        };
        res.render(snippetsPath + snippet);
      });
    });
  });
};
