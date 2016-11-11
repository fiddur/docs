import express from 'express';
import pug from 'pug';
import { resolve } from 'path';
import docs from '../pipeline';

const router = new express.Router();

router.get('/updates', (req, res, next) => {
  const updates = docs.getReduction('updates');
  const filename = resolve(__dirname, 'updates.pug');
  pug.renderFile(filename, { updates }, (err, html) => {
    if (err) {
      throw err;
    }
    const meta = {
      title: 'Auth0 Content & SDK Updates',
      description: ''
    };
    res.locals.staticPage = { html, meta };
    next();
  });
});

router.get('/updates/feed', (req, res) => {
  const updates = docs.getReduction('updates');
  const filename = resolve(__dirname, 'rss');
  res.set('Content-Type', 'application/rss+xml');
  res.render(filename, {
    title: 'Auth0 Content & SDK Updates',
    updates
  });
});

export default router;
