const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('post router');
});

router.post('/', async (req, res, next) => {});

module.exports = router;
