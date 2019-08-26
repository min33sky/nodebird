const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * POST /api/post
 * 게시물 작성
 */
router.post('/', async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id, // 작성자 ID (로그인 한 사용자)
    });
    if (hashtags) {
      // 해당 해쉬태그가 없으면 만들고 있으면 아무것도 안한다.
      const result = await hashtags.map((tag) => db.Hashtag.findOrCreate({
          where: {
            name: tag.slice(1).toLowerCase(),
          },
        }),);
      console.log('해쉬태그 : ', result);
      await newPost.addHashtags(result.map((e) => e[0]));
    }

    // * 현재 UserId 정보만 있으므로 프론트로 응답할 때 사용자 정보도 조인해서 보낸다.
    // : 프론트에서 로그인 한 사용자 정보가 필요하기 때문에

    // 방법 1)
    // const User = await newPost.getUser();
    // newPost.User = User;
    // return res.json(newPost);

    // 방법 2)
    const fullPost = await db.Post.findOne({
      where: {
        id: newPost.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname', 'userId'],
        },
      ],
    });
    res.json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
