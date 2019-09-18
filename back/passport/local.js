const passport = require('passport');
const bcrtypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'userId', passwordField: 'password' },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({
            where: { userId },
          });

          if (!user) {
            return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
          }

          const result = await bcrtypt.compare(password, user.password);

          if (!result) {
            return done(null, false, { reason: '비밀번호가 다릅니다.' });
          }
          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      },
    ),
  );
};
