import urls from '../../docs/redirect-urls';
import _ from 'lodash';
import nconf from 'nconf';

export default function redirects(app) {
  _.each(urls, function(urlInfo) {
    app.redirect(nconf.get('BASE_URL') + urlInfo.from, nconf.get('BASE_URL') + urlInfo.to, 301);
  });

  app.use(nconf.get('BASE_URL'), function(req, res, next) {
    if (!/^\/new/.exec(req.url)) return next();
    var url = req.url.replace(/^\/new/, '');
    res.redirect(301, nconf.get('BASE_URL') + url);
  });
};
