var nconf = require('nconf');
var docsSettings = require('../../docs/settings.json');
var alternative_title = require('../../lib/utils').alternative_title;

var Theme = function(docsapp) {
  this._docsapp = docsapp;
  docsapp.addPreRender(this._preRender.bind(this));
};

var merge = function (target, source) {
  for(var attr in source) {
    target[attr] = source[attr];
  }
  return target;
};

Theme.prototype._preRender = function(request, response, next) {
  var settings = merge(this._docsapp.getSettings(), docsSettings);
  var sections = response.doc.getSections();
  var title = response.doc.getMeta()['title'] || alternative_title(sections.content);
  var conanicalUrl = response.doc.getMeta()['canonical'];
  if (conanicalUrl) {
    conanicalUrl = nconf.get('DOMAIN_URL_DOCS') + nconf.get('BASE_URL') + conanicalUrl;
  }

  response.locals.site = response.locals.site || {};
  response.locals.site.title = settings['title'] || 'Default';
  response.locals.site.menus = settings['menus'] || {};
  response.locals.title = title;
  response.locals.canonicalUrl = conanicalUrl;
  response.locals.env = {
    BASE_URL:             nconf.get('BASE_URL'),
    MEDIA_URL:            nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN:         nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID:      nconf.get('AUTH0_CLIENT_ID'),
    COOKIE_SCOPE:         nconf.get('COOKIE_SCOPE'),
    DOMAIN_URL_SERVER:    nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY:          nconf.get('SEGMENT_KEY')
  };

  next();
};

module.exports = Theme;
