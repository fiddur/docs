import fs from 'fs';
import xtend from 'xtend';
import jade from 'jade';
import * as regions from '../regions';

var apiTmplPath = __dirname + '/api2-explorer.jade';

var apiTmpl = jade.compile(fs.readFileSync(apiTmplPath).toString(), {
  filename: apiTmplPath,
  pretty: true
});

export default function(req, res, next) {
  var tenant = req.user && req.user.tenant;
  var region = tenant ? tenant.region : 'default';

  var jadeContext = xtend({}, res.locals, {
    api2Domain: regions
      .get_namespace(region)
      .replace('{tenant}',
        tenant && tenant.name ? tenant.name : 'login')
  });

  if (res.locals.account.loggedIn && req.user.is_owner) {
    jadeContext.globalClientSecret = res.locals.account.globalClientSecret;
    jadeContext.globalClientID = res.locals.account.globalClientId;

  } else {
    jadeContext.globalClientSecret = '';
    jadeContext.globalClientID = '';
  }

  res.locals.api2Explorer = function() {
    return apiTmpl(jadeContext);
  };

  next();
};
