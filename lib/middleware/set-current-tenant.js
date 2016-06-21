import winston from 'winston';
import authorizations from '../authorizations';
import debug from 'debug';

const debugClient = debug('docs:middleware')

function mapSelection(tenant) {
  return typeof tenant === 'string' ? {
    name: tenant,
    region: 'default'
  } : tenant;
}

/*
 * Fetch regions and tenants, then set req.user.tenant with
 *    - the req.session.current_tenant if valid.
 *    - otherwise with the first or default tenant.
 */
export default function setCurrentTenant(req, res, next) {
  var done = function() {
    req.user.regions = req.session.current_regions;

    if (req.user.regions.length === 0) {
      // new user
      delete req.user.tenant;
      return next();
    }

    var is_valid = function(tenant) {
      return tenant && req.user.regions.some(function(region) {
        return region.name === tenant.region &&
          region.tenants.indexOf(tenant.name) > -1;
      });
    };

    var tenant = mapSelection(req.session.current_tenant || req.user.default_tenant);

    debugClient('current_tenant:', tenant, 'is_valid:', is_valid(tenant));

    req.user.tenant = is_valid(tenant) ? tenant : {
      name: req.user.regions[0].tenants[0],
      region: req.user.regions[0].name
    };

    req.session.current_tenant = req.user.tenant;

    winston.info('Current tenant is: ' + req.user.tenant.name + ' region: ' + req.user.tenant.region);
    winston.info('Region list', req.user.regions);

    next();
  };

  if (!req.user) {
    return next();
  }

  if (req.session.current_regions) {
    return done();
  }

  authorizations.getRegionsAndTenants(req.user.id, function(err, regions) {
    if (err) {
      winston.error('get user tenants error: ' + err.message);
      return res.status(500).send(err.message);
    }

    req.session.current_regions = regions;

    done();
  });
}
