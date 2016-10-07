import express from 'express';
import nconf from 'nconf';
import pug from 'pug';
import updates from './updates';

var router = express.Router();

router.get('/updates', function(req, res) {
  pug.renderFile(path.join(__dirname, '/updates.pug'), { updates }, (err, html) => {
    if (err) {
      throw err;
    }
    res.locals.staticPage = {
      html,
      pageTitle: 'Auth0 Content & SDK Updates',
      pageDescription: ''
    };
    next();
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
