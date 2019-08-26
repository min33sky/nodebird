module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    // 테이블명은 users
    'User',
    {
      nickname: {
        type: DataTypes.STRING(20), // 20글자 이하
        allowNull: false, // 필수
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100), // 100글자 이하
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글이 저장돼요
    },
  );

  User.associate = (db) => {
    /**
     * through: 다대다 관계에서 생기는 테이블
     * as: 같은 테이블에 다른 관계가 생길 때 구별하기 위한 이름
     *     해당 이름의 배열로 시퀄라이즈에서 값을 가져온다.
     */
    db.User.hasMany(db.Post, { as: 'Posts' });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'followingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'followerId',
    });
  };

  return User;
};
