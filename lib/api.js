import _ from 'lodash';
import express from 'express';
import docs from './pipeline';
import { cards } from './data/navigation';

const router = express.Router();

function createHandler(func) {
  return (req, res) => {
    const result = func(req);
    if (!result) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found' });
    }
    return res.json(result);
  };
}

router.get('/connections', createHandler(req => {
  const connections = docs.getReduction('connections');
  return { connections };
}));

router.get('/connections/:connectionType', createHandler(req => {
  const connections = docs.getReduction('connections');
  const result = _.filter(connections, { type: req.params.connectionType });
  if (result && result.length > 0) {
    return { connections: result };
  }
  return undefined;
}));

router.get('/connections/:connectionType/:hash', createHandler(req => {
  const connections = docs.getReduction('connections');
  return _.find(connections, { type: req.params.connectionType, hash: req.params.hash });
}));

router.get('/quickstart', createHandler(req => {
  const quickstarts = docs.getReduction('quickstarts');
  return quickstarts;
}));

router.get('/platforms', createHandler(req => {
  const platforms = docs.getReduction('platforms');
  return { platforms };
}));

router.get('/cards', createHandler(req => {
  return { cards };
}));

router.get('/articles', createHandler(req => {
  return undefined; //TODO
}));

router.get('/snippets/:path*', createHandler(req => {
  const snippets = docs.getReduction('snippets');
  const result = snippets.get(req.params.path || '/');
  return result;
}));

export default router;
