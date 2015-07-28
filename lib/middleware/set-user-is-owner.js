var winston = require('winston');
var authorizations = require('../authorizations');

function equal_tenants (a, b) {
  return a.name === b.name && a.region === b.region;
}

module.exports = function (req, res, next) {
  if (!req.user || !req.user.tenant) {
    return next();
  }

  if ('tenant_owner' in req.session &&
      equal_tenants(req.session.tenant_owner.tenant, req.user.tenant)) {
    req.user.is_owner = req.session.tenant_owner.is_owner;
    return next();
  }

  var params = {
    tenant: req.user.tenant.name,
    region: req.user.tenant.region
  };

  authorizations.getTenantOwners(params, function (err, owners) {
    if (err) {
      winston.error('authorizations.getTenantOwners', { tenant: req.user.tenant, error: err });
      return res.sendStatus(500);
    }

    var is_owner = (owners || []).some(function (o) {
      return o.id === req.user.id || o.id === 'mr|' + req.user.id;
    });

    req.session.tenant_owner = {
      is_owner: is_owner,
      tenant:   req.user.tenant
    };

    req.user.is_owner = req.session.tenant_owner.is_owner;
    next();
  });
};
