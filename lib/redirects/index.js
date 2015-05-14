var urls = require('../../docs/redirect-urls');
var _ = require('lodash');
var nconf = require('nconf');

module.exports = function (app) {
  _.each(urls, function(urlInfo) {
    app.redirect(nconf.get('BASE_URL') + urlInfo.from, nconf.get('BASE_URL') + urlInfo.to, 301);
  });

  app.use(nconf.get('BASE_URL'), function(req, res, next) {
    if (!/^\/new/.exec(req.url)) return next();
    var url = req.url.replace(/^\/new/, '');
    res.redirect(301, nconf.get('BASE_URL') + url);
  });

  // 301 for client-platform spa renamed to javascript
  app.redirect(nconf.get('BASE_URL') + '/quickstart/spa/spa', '/quickstart/spa/javascript', 301);
  app.redirect(nconf.get('BASE_URL') + '/quickstart/spa/spa/:api', '/quickstart/spa/javascript/:api', 301);

  // 301 for apptype web renamed to webapp
  app.redirect(nconf.get('BASE_URL') + '/quickstart/web', '/quickstart/webapp', 301);
  app.redirect(nconf.get('BASE_URL') + '/quickstart/web/:platform', '/quickstart/webapp/:platform', 301);

  // 301 for server-api ror-api renamed to rails-api
  app.redirect(nconf.get('BASE_URL') + '/quickstart/:apptype/:platform/ror-api', '/quickstart/:apptype/:platform/rails-api', 301);
};
