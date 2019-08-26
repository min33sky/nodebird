import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Button } from 'antd';

import { logoutAction } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction);
  }, []);

  return (
    <div>
      <Card
        actions={[
          <div key="twit">
            게시물
            <br />
            {me.Posts.length}
          </div>,
          <div key="following">
            팔로잉
            <br />
            {me.Followings.length}
          </div>,
          <div key="follower">
            팔로워
            <br />
            {me.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{me.nickname[0]}</Avatar>}
          title={me.nickname}
          description="나는 누구인가요?"
        />
      </Card>
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};

export default UserProfile;
