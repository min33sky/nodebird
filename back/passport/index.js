const passport = require('passport');
const db = require('../models');
const local = require('./local');

/**
 * PASSPORT SESSIONS
 */
module.exports = () => {
  // * 로그인 할 때 유저의 아이디와 쿠키가 세션에 저장된다.
  // serializeUser(): 라우터에서 req.login() 함수를 호출할 때 호출되는 함수
  // 얘) [{id:2, cookie: 'ckqweq'}]
  passport.serializeUser((user, done) => done(null, user.id));

  // * 로그인을 한 후에는 프론트에서는 쿠키로만 서버에 접근한다.
  // 클라이언트에서 보낸 쿠키와 세션의 쿠키가 일치하면 아이디로 유저 정보를 가져온다.
  // ! 요청이 올 때마다 deserializeUser()호출하기 때문에
  // ! DB의 잦은 호출로 자원 낭비가 심할 수 있다.
  // ! 그래서 캐싱을 통해서 DB 사용을 최소화 하는게 좋다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: {
          id,
        },
        include: [
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
      });
      return done(null, user); // req.user에 저장되고 서버에서 사용할 수 있다.
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  // Local Strategy 연결
  local();
};
