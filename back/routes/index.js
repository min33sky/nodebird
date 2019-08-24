const express = require('express');

const router = express.Router();

const userCtrl = require('./user');
const postCtrl = require('./post');
const commentCtrl = require('./comment');

router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/comment', commentCtrl);

module.exports = router;
