import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Button } from 'antd';

import { logoutAction } from '../reducers/user';

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction);
  }, []);

  return (
    <div>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {user.Post.length}
          </div>,
          <div key="following">
            팔로잉
            <br />
            {user.Followings.length}
          </div>,
          <div key="follower">
            팔로워
            <br />
            {user.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{user.nickname[0]}</Avatar>}
          title={user.nickname}
          description="설명적는 곳"
        />
      </Card>
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};

export default UserProfile;
