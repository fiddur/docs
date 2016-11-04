import express from 'express';
import docs from './pipeline';

const router = new express.Router();

router.get('/sitemap.xml', (req, res) => {
  const sitemap = docs.getReduction('sitemap');
  res.header('Content-Type', 'application/xml');
  res.send(sitemap.xml);
});

router.get('/sitemap.json', (req, res) => {
  const sitemap = docs.getReduction('sitemap');
  res.json({ articles: sitemap.urls });
});

export default router;
