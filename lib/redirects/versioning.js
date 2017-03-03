import express from 'express';
import urljoin from 'url-join';
import docs from '../pipeline';

const router = new express.Router();

docs.whenReady(() => {
  const topics = docs.getReduction('versions');
  topics.forEach(topic => {
    topic.versions.forEach(version => {
      const url = urljoin(topic.baseUrl, version.name, ':article');
      router.get(`/${url}`, (req, res, next) => {
        res.redirect(302, version.url);
      });
    });
  });
});

export default router;
