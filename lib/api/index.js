import nconf from 'nconf';
import _ from 'lodash';
import * as middleware from '../middleware';
import express from 'express';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import landings from '../collections/landings';
import quickstartCollections from '../collections/quickstarts';
import connectionsCollection from '../collections/connections';
import platformsCollection from '../collections/platforms';
import prepareImage from './image_formatter'
import prepareLandingPages from './landing_formatter'

var router = express.Router();

// These are used by the snippets api to do @@value@@ string replacement
router.use(middleware.defaultValues);
router.use(middleware.appendTicket);
router.use(middleware.overrideIfAuthenticated);
router.use(middleware.overrideIfClientInQs);
router.use(middleware.overrideIfClientInQsForPublicAllowedUrls);

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

    // Clean up the URL for the CDN
    item.image = prepareImage(item.image);

    if (item.content) {
      item.content = item.content(context);
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
  prepareItems(clone.items || clone);
  return clone;
};



/////////// Connections API
// Connections doesnt need any context, so we will do this globaly;
var connections = prepareData({}, connectionsCollection);
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

// TEMP: Remove the app type for Backend since the dashbaord doesnt handle the UI for it yet
var appTypesCopy = prepareData({}, quickstartCollections.apptypes);
appTypesCopy.pop();


/////////// Quickstart API
router.get('/quickstart', json.bind(json, {
  app_types: appTypesCopy,
  client_platforms: prepareData({}, quickstartCollections.clientPlatforms),
  hybrid_platforms: prepareData({}, quickstartCollections.hybridPlatforms),
  native_platforms: prepareData({}, quickstartCollections.nativePlatforms),
  server_platforms: prepareData({}, quickstartCollections.serverPlatforms),
  server_apis: prepareData({}, quickstartCollections.serverApis)
}));

/////////// Platforms API
// Platforms doesnt need any context, so we will do this globaly;
var platforms = prepareData({}, platformsCollection);
router.get('/platforms', json.bind(json, { platforms: platforms }));

/////////// Collections APIs (articles, snippets)
function addCollectionRoutes(name, collection, includeRoot) {
  includeRoot = typeof includeRoot === 'undefined' ? true : includeRoot;

  if (includeRoot) { addRootRoute(name, collection); }

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

function addRootRoute(name, collection) {
  router.get('/' + name, json.bind(json, function(req, res) {
    var result = {};
    result[name] = prepareData(res.locals, collection.items);
    return result;
  }));
}

addCollectionRoutes('articles', articles);
addCollectionRoutes('snippets', snippets);
addCollectionRoutes('landings', landings, false);

router.get('/landings', json.bind(json, function(req, res) {
  return prepareLandingPages(landings.pages);
}));



export default router;
