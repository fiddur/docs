import express from 'express';
import nconf from 'nconf';
import updates from './updates';

var router = express.Router();

router.get('/updates', function(req, res) {
  res.render(__dirname + '/updates', {
    title: 'Auth0 Content & SDK Updates',
    updates: updates
  });
});

router.get('/updates/feed', function(req, res) {
  res.set('Content-Type', 'application/rss+xml');
  res.render(__dirname + '/rss', {
    title: 'Auth0 Content & SDK Updates',
    updates: updates
  });
});

export default router;
