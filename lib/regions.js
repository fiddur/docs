import Auth0 from 'auth0';
import xtend from 'xtend';
import env from './env';

var default_region = {
  description: env['DEFAULT_REGION_DESCRIPTION'],
  name: 'default',
  clientID: env['AUTH0_CLIENT_ID'],
  clientSecret: env['AUTH0_CLIENT_SECRET'],
  namespace: env['DOMAIN_URL_SERVER'],
  assets: env['DOMAIN_URL_ASSETS'],
  domain: env['DOMAIN_URL_SERVER'].replace(/\{tenant\}/g, env['AUTH0_TENANT'])
};

var regions = [default_region];


if (env['REGIONS']) {
  regions = regions.concat(Object.keys(env['REGIONS']).map(function(name) {
    return {
      description: env['REGIONS'][name]['DESCRIPTION'],
      name: name,
      clientID: env['REGIONS'][name]['AUTH0_CLIENT_ID'],
      clientSecret: env['REGIONS'][name]['AUTH0_CLIENT_SECRET'],
      namespace: env['REGIONS'][name]['DOMAIN_URL_SERVER'],
      domain: env['REGIONS'][name]['DOMAIN_URL_SERVER'].replace(/\{tenant\}/g, env['AUTH0_TENANT']),
      assets: env['REGIONS'][name]['DOMAIN_URL_ASSETS']
    };
  }));
}

/*
 * Returns a region given its name.
 */
export function get(region_name) {
  return regions.filter(function(r) {
    return r.name === region_name;
  })[0];
}

export function get_domain(region_name) {
  return regions.filter(function(r) {
    return r.name === region_name;
  })[0].domain;
}

export function get_namespace(region_name) {
  return regions.filter(function(r) {
    return r.name === region_name;
  })[0].namespace;
}

export var name_list = regions.map(function(r) {
  return {
    name: r.name,
    description: r.description,
    namespace: r.namespace
  };
});

var clients = {};

export function get_client(region_name) {
  if (!clients[region_name]) {

    var region = regions.filter(function(r) {
      return r.name === region_name;
    })[0];

    if (typeof region === 'undefined') {
      throw new Error('unknown region ' + region_name);
    }

    clients[region_name] = new Auth0(region);
  }
  return clients[region_name];
}

/*
 * Maps a local tenantUser instance to a foreign.
 * Append 'mr|' if the account is on a non-default server.
 */
export function map_user(region_name, user) {
  if (region_name === 'default') {
    return user;
  }

  if (typeof user === 'string') {
    return 'mr|' + user;
  }

  return xtend(user, {
    id: this.map_user(region_name, user.id)
  });
}
