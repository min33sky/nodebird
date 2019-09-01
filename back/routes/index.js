const express = require('express');

const router = express.Router();

const userCtrl = require('./user');
const postCtrl = require('./post');
const postsCtrl = require('./posts');
const hashtagCtrl = require('./hashtag');

router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/posts', postsCtrl);
router.use('/hashtag', hashtagCtrl);

module.exports = router;
