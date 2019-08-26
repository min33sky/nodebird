const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * GET /api/posts
 * 모든 포스트 불러오기
 */
router.get('/', async (req, res, next) => {
  try {
    // 포스트 모두 가져오기 & 유저 정보도 같이 가져오자
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname', 'userId'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
