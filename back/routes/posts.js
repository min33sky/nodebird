const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * GET /api/posts
 * 모든 포스트 불러오기
 */
router.get('/', async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than
        },
      };
    }

    const posts = await db.Post.findAll({
      // 게시물에 대한 유저 정보와 이미지 정보까지 함께 불러온다.
      // [{ 게시물 정보, User: {id, nickname, userId},
      //    Images: [{src: 이미지주소}, ...]}, Likers: [{id; 사용자아이디}, ...] ...]
      where,
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname', 'userId'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          through: 'Like',
          attributes: ['id'],
        },
        {
          model: db.Post,
          as: 'Retweet',
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']], // 생성일 내림차순으로 정렬
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
