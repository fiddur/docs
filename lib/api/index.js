import _ from 'lodash';
import * as middleware from '../middleware';
import express from 'express';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import quickstartCollections from '../collections/quickstarts';
import connectionsCollection from '../collections/connections';
import platformsCollection from '../collections/platforms';
import { prepareData } from './formatters';
import winston from 'winston';

var router = express.Router();

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
var connections = prepareData({}, connectionsCollection, 'connections');
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
router.get('/quickstart', json.bind(json, prepareData({}, quickstartCollections, 'quickstarts')));

/////////// Platforms API
// Platforms doesnt need any context, so we will do this globaly;
var platforms = prepareData({}, platformsCollection, 'platforms');
router.get('/platforms', json.bind(json, { platforms: platforms }));

/////////// Collections APIs (articles, snippets)
function addCollectionRoutes(name, collection) {

  router.get('/' + name, json.bind(json, function(req, res) {
    var result = {};
    result[name] = prepareData(res.locals, collection.items, name);
    return result;
  }));

  router.get('/' + name + '/*', json.bind(json, function(req, res, next) {
    var parts = req.params[0].replace('/meta/' + name + '/').split('/');
    var current = collection;
    for (var i = 0; i < parts.length; i++) {
      current = _.find(current.items, { hash: parts[i] });
      if (!current) {
        break;
      }
    }
    if (current) {
      try {
        return prepareData(res.locals, current, name);
      } catch (err) {
        next(err);
      }
    }
  }));
}

addCollectionRoutes('articles', articles);
addCollectionRoutes('snippets', snippets);

export default router;
