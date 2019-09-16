const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const passportConfig = require('./passport');
const db = require('./models');
const api = require('./routes');

const PORT_NUMBER = 8080;

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
app.use('/', express.static('uploads'));
app.use(express.json()); //  JSON Request Parsing
app.use(express.urlencoded({ extended: true })); // Form Request Parsing
app.use(
  // 서버주소와 프론트주소가 다를 때 쿠키를 주고받기 위한 설정
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // https를 쓸 때 true
    },
    name: 'ndrck', // 보안을 위해 이름 지정 (express-session 기본 값: session.id)
  }),
);
app.use(passport.initialize());
app.use(passport.session()); // express-session보다 아래에 위치

app.use('/api', api); // API Router

app.get('/', (req, res) => {
  res.send('Hello, Server');
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
