var nconf = require('nconf');
var connections = require('../connections-collection');
var quickstartCollections = require('../quickstart-collections');
var articles = require('../articles-collection').articles;
var _ = require('lodash');

var json = function(data, req, res) {
  var result;
  if (typeof data === 'function') {
    result = data(req, res);
  } else {
    result = data;
  }

  if (!result) {
    res.send(501);
    return;
  }
  if (req.query.callback) {
    res.jsonp(result);
  } else {
    res.json(result);
  }
}

var urlsToAbsolute = function(items) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.items) {
      urlsToAbsolute(item.items);
    }
    item.url = nconf.get('DOMAIN_URL_DOCS') + item.url;
    if (item.image) {
      item.image = item.image ? nconf.get('MEDIA_URL') + item.image.replace('/media', '') : null;
    }
  }
}
urlsToAbsolute(articles.items);
urlsToAbsolute(connections);

module.exports = function (app) {

  // Connections API
  app.get(nconf.get('BASE_URL') + '/meta/connections', json.bind(json, { connections: connections }));
  app.get(nconf.get('BASE_URL') + '/meta/connections/:connectionType', json.bind(json, function(req) {
    return { connections: _.filter(connections, { 'type': req.params.connectionType }) };
  }));
  app.get(nconf.get('BASE_URL') + '/meta/connections/:connectionType/:hash', json.bind(json, function(req) {
    return _.find(connections, { 'type': req.params.connectionType, 'hash': req.params.hash });
  }));

  app.get(nconf.get('BASE_URL') + '/meta/quickstart', json.bind(json, quickstartCollections));

  // Article Collections API
  app.get(nconf.get('BASE_URL') + '/meta/articles', json.bind(json, { articles: articles.items }));
  app.get(nconf.get('BASE_URL') + '/meta/articles/*', json.bind(json, function(req, res) {
    var parts = req.params[0].replace('/meta/articles/').split('/');
    var current = articles;
    for (var i = 0; i < parts.length; i++) {
      current = _.find(current.items, { hash: parts[i] });
      if (!current) {
        break;
      }
    }
    return current;
  }));
}
