import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Avatar } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import { LOAD_USER_REQUEST } from '../reducers/user';

/**
 * GET /user/:id
 * 특정 유저 정보와 게시물들 보여주는 페이지
 */
const User = () => {
  const { mainPosts } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

User.getInitialProps = async (context) => {
  const id = parseInt(context.query.id, 10);
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });
  return { id };
};

export default User;
