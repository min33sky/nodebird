const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

/**
 * GET /api/user
 * 로그인 한 사용자 정보 가져오기
 */
router.get('/', (req, res) => {
  if (!req.user) {
    // 로그인 하지않은 유저
    return res.status(401).send('로그인하지 않은 사용자입니다..');
  }
  // ! 보안상 비밀번호는 보내지 않는다.
  // ? TypeError: Converting circular structure to JSON 해결하기
  // sequelize에서 온 객체가 JSON 형태가 아니기 때문에 변환을 해야된다.
  // const filteredUser = { ...user.toJSON() };
  // delete filteredUser.password;
  // Sequelize의 결과값을 JSON으로 변환
  const user = { ...req.user.toJSON() };
  delete user.password;
  return res.json(user);
});

/**
 * GET /api/user/:id
 * 특정 사용자 정보 불러오기
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: db.Post,
          as: 'Posts',
          attributes: ['id'],
        },
        {
          model: db.User,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: db.User,
          as: 'Followers',
          attributes: ['id'],
        },
      ],
      attributes: ['id', 'nickname'],
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

/**
 * POST /api/user
 * 회원 가입
 */
router.post('/', async (req, res, next) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 존재하는 회원입니다.');
    }

    // bcrypt의 salt 값은 10~13정도로 준다.
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    return res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    // TODO: 에러 처리
    return next(error);
  }
});

/**
 * POST /api/user/login
 * 로그인
 */
router.post('/login', (req, res, next) => {
  /**
   * * 로컬 전략을 수행한 후 콜백 함수가 호출된다.
   * - err: 시스템 에러
   * - user: 로그인 성공 시 유저 정보
   * - info: 로그인 실패 시 실패 이유
   */
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      console.log(info);
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const fullUser = await db.User.findOne({
        where: {
          id: user.id,
        },
        include: [
          // 길이만 필요하므로 id값만 가져온다.
          {
            model: db.Post,
            as: 'Posts',
            attributes: ['id'],
          },
          {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
          },
          {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
          },
        ],
        // 비밀번호는 포함하지 않는다.
        attributes: ['id', 'nickname', 'userId'],
      });
      return res.json(fullUser);
    });
  })(req, res, next);
});

/**
 * GET /api/user/:id/posts
 * 해당 사용자의 게시물 불러오기
 */
router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10),
        RetweetId: null,
      },
      include: [
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

/**
 * POST /api/user/logout
 * 로그아웃
 */
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Logout Success');
});

module.exports = router;
