var nconf = require('nconf');
var connections = require('../connections-collection');
var quickstartCollections = require('../quickstart-collections');
var articles = require('../articles-collection').articles;
var snippets = require('../snippets-collection').snippets;
var _ = require('lodash');
var docProcessors = require('../doc-processors');
var defaultValues = require('../middleware/defaultValues');
var overrideIfAuthenticated = require('../middleware/overrideIfAuthenticated');
var overrideIfClientInQsForPublicAllowedUrls = require('../middleware/overrideIfClientInQsForPublicAllowedUrls');
var overrideIfClientInQs = require('../middleware/overrideIfClientInQs');
var appendTicket = require('../middleware/appendTicket');
import express from 'express';
var router = express.Router();

// These are used by the snippets api to do @@value@@ string replacement
router.use(defaultValues);
router.use(appendTicket);
router.use(overrideIfAuthenticated);
router.use(overrideIfClientInQs);
router.use(overrideIfClientInQsForPublicAllowedUrls);

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

// Connections API
router.get('/connections', json.bind(json, { connections: connections }));
router.get('/connections/:connectionType', json.bind(json, function(req) {
  var result = _.filter(connections, { 'type': req.params.connectionType });
  if (result && result.length > 0) {
    return { connections: result };
  }
}));
router.get('/connections/:connectionType/:hash', json.bind(json, function(req) {
  return _.find(connections, { 'type': req.params.connectionType, 'hash': req.params.hash });
}));

// Quickstart API
router.get('/quickstart', json.bind(json, {
  app_types: quickstartCollections.apptypes,
  client_platforms: quickstartCollections.clientPlatforms,
  hybrid_platforms: quickstartCollections.hybridPlatforms,
  native_platforms: quickstartCollections.nativePlatforms,
  server_platforms: quickstartCollections.serverPlatforms,
  server_apis: quickstartCollections.serverApis
}));

router.get('/test', function(req, res) {
  res.json(res.locals.account.namespace);
});

// Collections APIs (articles, snippets)
function addCollectionRoutes(name, collection) {
  router.get('/' + name, json.bind(json, function(req, res) {
    var result = {};
    result[name] = prepareData(res.locals, collection.items);
    return result;
  }));
  router.get('/' + name + '/*', json.bind(json, function(req, res) {
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

export default router;
