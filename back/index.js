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

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
  }),
);
app.use(passport.initialize());
app.use(passport.session()); // express-session보다 아래에 위치

// Router
app.use('/api', api);

app.get('/', (req, res) => {
  res.send('Hello, Server');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
