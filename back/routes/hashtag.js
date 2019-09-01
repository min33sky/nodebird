const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * GET /hashtag/:tag
 * 해쉬태그명으로 포스트 불러오기
 */
router.get('/:tag', async (req, res, next) => {
  try {
    // [{ 게시글 내용, Hashtags: [content], User: {id, nickname}, Images: []}, ...]
    const posts = await db.Post.findAll({
      // ! 태그 검색이기 때문에 해시태그에서 where조건을 준 후 조인한다.
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
        {
          model: db.Image,
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
