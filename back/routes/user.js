const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

/**
 * GET /api/user
 * 로그인 한 사용자 정보 가져오기
 */
router.get('/', isLoggedIn, (req, res) => {
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
    // { 사용자 정보, Posts: [], Followings: [], Follings: [] }
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

    // * 팔로워, 팔로잉은 개인 정보 유출이 될 수 있으므로 몇 명인지만 보내준다.
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
    // [{ 게시물 내용, User: {id, nickname}}, Images: [] ...]
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        RetweetId: null, // 리트윗한건 가져오지 않는다.
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
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

/**
 * POST /api/user/:id/follow
 * 팔로우
 */
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    // req.user에서 바로 관계 설정이 더 성능에 좋지만
    //  가끔 오류가 있어서 일단 내 정보를 가져온다.
    const user = await db.User.findOne({ where: { id: req.user.id } });
    await user.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * DELETE /api/user/:id/follow
 * 언팔로우
 */
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.user.id } });
    await user.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * POST /api/user/:id/followers
 * 팔로워 목록 가져오기
 */
router.post('/:id/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
    });
    res.json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * POST /api/user/:id/followings
 * 팔로잉 목록 가져오기
 */
router.post('/:id/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followings = await user.getFollowings({
      attributes: ['id', 'nickname'],
    });
    res.json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * DELETE /api/user/:id/follower
 * 팔로워 삭제
 */
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({ where: { id: req.user.id } });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * PATCH /api/user/nickname
 * 닉네임 수정
 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );
    console.log('###################### : ', req.body.nickname);
    res.send(req.body.nickname);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
