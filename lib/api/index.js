import _ from 'lodash';
import express from 'express';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import quickstartCollections from '../collections/quickstarts';
import connectionsCollection from '../collections/connections';
import platformsCollection from '../collections/platforms';
import { prepareData } from './formatters';
import { cards as cardsCollection } from '../data/navigation';

const router = express.Router();

function json(data, req, res) {
  let result;
  if (typeof data === 'function') {
    result = data(req, res);
  } else {
    result = data;
  }

  if (!result) {
    return res.status(404).json({ statusCode: 404, error: 'Not Found' });
  }

  return res.json(result);
}


// Connections API
// Connections doesnt need any context, so we will do this globaly;
const connections = prepareData({}, connectionsCollection, 'connections');
router.get('/connections', json.bind(json, { connections }));
router.get('/connections/:connectionType', json.bind(json, (req) => {
  const result = _.filter(connections, { type: req.params.connectionType });
  if (result && result.length > 0) {
    return { connections: result };
  }
  return undefined;
}));
router.get('/connections/:connectionType/:hash', json.bind(json, (req) =>
  _.find(connections, { type: req.params.connectionType, hash: req.params.hash })
));

// Quickstart API
router.get('/quickstart', json.bind(json, prepareData({}, quickstartCollections, 'quickstarts')));

// Platforms API
// Platforms doesnt need any context, so we will do this globaly;
const platforms = prepareData({}, platformsCollection, 'platforms');
router.get('/platforms', json.bind(json, { platforms }));

// Cards API
const cards = prepareData({}, cardsCollection, 'cards');
router.get('/cards', json.bind(json, { cards }));

// Collections APIs (articles, snippets)
function addCollectionRoutes(name, collection) {
  router.get(`/${name}`, json.bind(json, (req, res) => {
    const result = {};
    result[name] = prepareData(res.locals, collection.items, name);
    return result;
  }));

  router.get(`/${name}/*`, json.bind(json, (req, res, next) => {
    const parts = req.params[0].replace(`/meta/${name}/`).split('/');
    let current = collection;
    for (let i = 0; i < parts.length; i++) {
      current = _.find(current.items, { hash: parts[i] });
      if (!current) {
        break;
      }
    }
    if (current) {
      try {
        return prepareData(res.locals, current, name);
      } catch (err) {
        return next(err);
      }
    }
    return undefined;
  }));
}

addCollectionRoutes('articles', articles);
addCollectionRoutes('snippets', snippets);

export default router;
