import _ from 'lodash';
import * as middleware from '../middleware';
import express from 'express';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import quickstartCollections from '../collections/quickstarts';
import connectionsCollection from '../collections/connections';
import platformsCollection from '../collections/platforms';
import {prepareExternalData} from '../utils';

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

/////////// Connections API
// Connections doesnt need any context, so we will do this globaly;
var connections = prepareExternalData({}, connectionsCollection);
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

/////////// Quickstart API
router.get('/quickstart', json.bind(json, {
  app_types: quickstartCollections.apptypes,
  client_platforms: prepareExternalData({}, quickstartCollections.clientPlatforms),
  hybrid_platforms: prepareExternalData({}, quickstartCollections.hybridPlatforms),
  native_platforms: prepareExternalData({}, quickstartCollections.nativePlatforms),
  server_platforms: prepareExternalData({}, quickstartCollections.serverPlatforms),
  server_apis: prepareExternalData({}, quickstartCollections.serverApis)
}));

/////////// Platforms API
// Platforms doesnt need any context, so we will do this globaly;
var platforms = prepareExternalData({}, platformsCollection);
router.get('/platforms', json.bind(json, { platforms: platforms }));

/////////// Collections APIs (articles, snippets)
function addCollectionRoutes(name, collection) {
  router.get('/' + name, json.bind(json, function(req, res) {
    var result = {};
    result[name] = prepareExternalData(res.locals, collection.items);
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
      return prepareExternalData(res.locals, current);
    }
  }));
}

addCollectionRoutes('articles', articles);
addCollectionRoutes('snippets', snippets);

export default router;
