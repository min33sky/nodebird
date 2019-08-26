const express = require('express');

const router = express.Router();

const userCtrl = require('./user');
const postCtrl = require('./post');
const postsCtrl = require('./posts');
const commentCtrl = require('./comment');

router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/comment', commentCtrl);
router.use('/posts', postsCtrl);

module.exports = router;
