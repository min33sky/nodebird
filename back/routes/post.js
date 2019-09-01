const express = require('express');
const multer = require('multer');
const path = require('path');
const { isLoggedIn } = require('./middleware');
const db = require('../models');

const router = express.Router();

/**
 * Multer Setting
 */
const upload = multer({
  // diskStorage: 설정한 업로드 폴더에 업로드
  storage: multer.diskStorage({
    destination(req, file, done) {
      // uploads 폴더에 저장
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // ex) madrid.png -> ext: .png, basename: madrid
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, // 업로드 20MB 제한
  },
});

/**
 * POST /api/post
 * 게시물 작성
 * * upload.none() : 이미지 업로드가 아니라 이미지 주소를 받기 때문에
 * - 폼데이터 파일: req.file(s)
 * - 폼데이터 일반 값: req.body
 */
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id, // 작성자 ID (로그인 한 사용자)
    });
    if (hashtags) {
      // * Promise.all() : 프로미즈 여러개를 한번에 실행
      const result = await Promise.all(
        // findOrCreate: 해당 해쉬태그가 없으면 만들고 있으면 아무것도 안한다.
        hashtags.map((tag) => db.Hashtag.findOrCreate({
            where: {
              name: tag.slice(1).toLowerCase(),
            },
          }),),
      );
      console.log('해시태그: ', result);
      await newPost.addHashtags(result.map((e) => e[0]));
    }

    /**
     * 이미지 주소를 포함한 게시물
     * - 이미지 주소가 여러개라면 image: [주소1, 주소2, ...]
     * - 이미지 주소가 하나면 image: 주소1
     */
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => db.Image.create({ src: image })),
        );
        // 게시글과 이미지 관계 설정
        await newPost.addImages(images);
      } else {
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }

    // * 현재 UserId 정보만 있으므로 프론트로 응답할 때 사용자 정보와 이미지를 조인해서 보낸다.
    // * 프론트에서 로그인 한 사용자 정보와 이미지가 필요하기 때문에

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
        {
          model: db.Image,
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
 * POST /api/post/images
 * 이미지 업로드
 * * upload.array('image') : FormData에서 보낸 필드명, 여러개는 배열로 오므로 array
 */
router.post('/images', upload.array('image'), (req, res) => {
  res.json(req.files.map((v) => v.filename));
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
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  try {
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
