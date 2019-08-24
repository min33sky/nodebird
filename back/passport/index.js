const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  /**
   * PASSPORT SESSIONS
   */

  // 로그인 할 때 유저의 아이디와 쿠키가 세션에 저장된다.
  // 얘) [{id:2, cookie: 'ckqweq'}]
  passport.serializeUser((user, done) => done(null, user.id));

  // 로그인을 한 후에는 쿠키로 세션에 접근한다.
  // 클라이언트에서 보낸 쿠키와 세션의 쿠키가 일치하면 아이디로 유저 정보를 가져온다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: {
          id,
        },
      });
      return done(null, user); // req.user에 저장된다.
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  // Local Strategy 연결
  local();
};
