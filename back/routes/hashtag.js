const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * GET /hashtag/:tag
 * 해쉬태그명으로 포스트 불러오기
 */
router.get('/:tag', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.Hashtag,
          where: {
            // 한글, 특수문자가 주소를 통해 서버로 갈 때는
            // URIComponent로 바뀌므로 디코딩해준다.
            name: decodeURIComponent(req.params.tag),
          },
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
