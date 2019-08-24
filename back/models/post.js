module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    // 테이블명은 posts
    'Post',
    {
      content: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', //  한글 +이모티콘
      collate: 'utf8mb4_general_ci',
    },
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 테이블에 UserId 컬럼이 생겨요
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // RetweetId 컬럼 생겨요
    // 다대다 관계는 모델 두 곳 모두 설정해야한다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
  };
  return Post;
};
