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
};
