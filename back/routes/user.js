const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user 라우터');
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
    console.log(newUser);
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
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      // 보안상 비밀번호는 보내지 않는다.
      const filteredUser = { ...user };
      delete filteredUser.password;
      return res.json(filteredUser);
    });
  })(req, res, next);
});

module.exports = router;
