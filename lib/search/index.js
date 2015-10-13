import express from 'express';
import nconf from 'nconf';

var router = express.Router();

router.get('/search', function(req, res) {
  res.render(__dirname + '/search', {
    search_engine_id: nconf.get('SEARCH_ENGINE_ID'),
    title: `Search Results for "${req.query.q}`,
    query: req.query.q
  });
});

export default router;
