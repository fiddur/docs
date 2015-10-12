import express from 'express';

var router = express.Router();

router.get('/search', function(req, res) {
  res.render(__dirname + '/search');
});

export default router;
