const express = require('express');
const db = require('../models');

const router = express.Router();

/**
 * POST /api/post
 * 게시물 작성
 */
router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      // 비로그인시 글쓰기 방지
      return res.status(401).send('Service requiring login');
    }

    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id, // 작성자 ID (로그인 한 사용자)
    });
    if (hashtags) {
      // * Promise.all() : 프로미즈 여러개를 한번에 실행
      const result = await Promise.all(
        // 해당 해쉬태그가 없으면 만들고 있으면 아무것도 안한다.
        hashtags.map((tag) => db.Hashtag.findOrCreate({
            where: {
              name: tag.slice(1).toLowerCase(),
            },
          }),),
      );
      await newPost.addHashtags(result.map((e) => e[0]));
    }

    // * 현재 UserId 정보만 있으므로 프론트로 응답할 때 사용자 정보도 조인해서 보낸다.
    // - 프론트에서 로그인 한 사용자 정보가 필요하기 때문에

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

/**
 * GET /api/post/:id/comments
 * 게시물 댓글들 불러오기
 */
router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!post) {
      return res.status(404).send('Post does not exist');
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: parseInt(req.params.id, 10),
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    if (!comments) {
      return res.status(404).send('Comments does not exist');
    }
    return res.json(comments);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * POST /api/post/:id/comment
 * 댓글 작성
 */
router.post('/:id/comment', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send('Service requiring login');
    }
    const post = await db.Post.findOne({
      where: parseInt(req.params.id, 10),
    });
    if (!post) {
      return res.status(404).send('Post does not exist');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });

    await post.addComment(newComment.id); // 게시물에 댓글 연결 (Sequelize)

    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      // 댓글 작성자 정보를 가져온다.
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    return res.json(comment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
