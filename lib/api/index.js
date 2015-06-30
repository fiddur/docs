var nconf = require('nconf');
var connections = require('../connections-collection');
var quickstartCollections = require('../quickstart-collections');
var articles = require('../articles-collection').articles;
var snippets = require('../snippets-collection').snippets;
var _ = require('lodash');
var docProcessors = require('../doc-processors');

var json = function(data, req, res) {
  var result;
  if (typeof data === 'function') {
    result = data(req, res);
  } else {
    result = data;
  }

  if (!result) {
    return res.status(404).json({ statusCode: 404, error: 'Not Found' });
  }

  if (req.query.callback) {
    res.jsonp(result);
  } else {
    res.json(result);
  }
};

var prepareData = function(context, data) {
  var fixItem = function(item) {
    if (item.url) {
      item.url = nconf.get('DOMAIN_URL_DOCS') + item.url;
    }
    if (item.image) {
      item.image = item.image ? nconf.get('MEDIA_URL') + item.image.replace('/media', '') : null;
    }
    if (item.content && typeof item.content === 'string') {
      item.content = docProcessors.mdProcessor({}, item.content);
      item.content = docProcessors.jsProcessor(context, item.content);
    }
  };

  var prepareItems = function(itemOrItems) {
    if (_.isArray(itemOrItems)) {
      for (var i = 0; i < itemOrItems.length; i++) {
        var item = itemOrItems[i];
        if (item.items) {
          prepareItems(item.items);
        }
        fixItem(item);
      }
    } else {
      fixItem(itemOrItems);
    }
  };

  var clone = _.cloneDeep(data);
  prepareItems(clone);
  return clone;
};

// Connections doesnt need any context, so we will do this globaly;
connections = prepareData({}, connections);

module.exports = function (app) {
  // Connections API
  app.get(nconf.get('BASE_URL') + '/meta/connections', json.bind(json, { connections: connections }));
  app.get(nconf.get('BASE_URL') + '/meta/connections/:connectionType', json.bind(json, function(req) {
    var result = _.filter(connections, { 'type': req.params.connectionType });
    if (result && result.length > 0) {
      return { connections: result };
    }
  }));
  app.get(nconf.get('BASE_URL') + '/meta/connections/:connectionType/:hash', json.bind(json, function(req) {
    return _.find(connections, { 'type': req.params.connectionType, 'hash': req.params.hash });
  }));

  // Quickstart API
  app.get(nconf.get('BASE_URL') + '/meta/quickstart', json.bind(json, {
    app_types: quickstartCollections.apptypes,
    client_platforms: quickstartCollections.clientPlatforms,
    hybrid_platforms: quickstartCollections.hybridPlatforms,
    native_platforms: quickstartCollections.nativePlatforms,
    server_platforms: quickstartCollections.serverPlatforms,
    server_apis: quickstartCollections.serverApis
  }));

  app.get(nconf.get('BASE_URL') + '/meta/test', function(req, res) {
    res.json(res.locals.account.namespace);
  });

  // Collections APIs (articles, snippets)
  function addCollectionRoutes(name, collection) {
    var urlBase = nconf.get('BASE_URL') + '/meta/' + name;
    app.get(urlBase, json.bind(json, function(req, res) {
      var result = {};
      result[name] = prepareData(res.locals, collection.items);
      return result;
    }));
    app.get(urlBase + '/*', json.bind(json, function(req, res) {
      var parts = req.params[0].replace('/meta/' + name + '/').split('/');
      var current = collection;
      for (var i = 0; i < parts.length; i++) {
        current = _.find(current.items, { hash: parts[i] });
        if (!current) {
          break;
        }
      }
      if (current) {
        return prepareData(res.locals, current);
      }
    }));
  }

  addCollectionRoutes('articles', articles);
  addCollectionRoutes('snippets', snippets);
};
