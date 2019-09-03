const db = require('../models');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('Service requiring login');
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('Logged in user is inaccessible.');
};

exports.isExistedPost = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Post,
          as: 'Retweet',
        },
      ],
    });
    if (post) {
      return next();
    }
    return res.status(404).send('Post does not exist');
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
