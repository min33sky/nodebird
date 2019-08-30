const express = require('express');
const next = require('next');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const PORT_NUMBER = 3060;

/**
 * NEXT에서 동적 라우팅이 불가능하므로
 * express를 연결해서 사용한다.
 * * next9에서는 동적라우팅 가능
 */

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
  const server = express();

  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }),
  );

  server.get('/hashtag/:tag', (req, res) => {
    // next로 라우팅  (마지막 인자값은 getInitialProps에서 사용할 수 있다.)
    return app.render(req, res, '/hashtag', { tag: req.params.tag });
  });

  server.get('/user/:id', (req, res) => {
    return app.render(req, res, '/user', { id: req.params.id });
  });

  /**
   * 위를 제외한 get 요청을 next의 get 요청 핸들러로 처리한다.
   */
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT_NUMBER, () => {
    console.log(`next+express running on port ${PORT_NUMBER}`);
  });
});
