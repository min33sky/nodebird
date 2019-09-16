import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';

import { logoutAction } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction);
  }, []);

  return (
    // * Link에 prefetch를 적용하면 미리 로드할 수 있다. (개발서버에선 효과 없음)
    <div>
      <Card
        actions={[
          <Link
            href={{
              pathname: '/user',
              query: {
                id: me.id,
              },
            }}
            as={`/user/${me.id}`}
            key="twit"
            prefetch
          >
            <a>
              <div>
                게시물
                <br />
                {me.Posts.length}
              </div>
            </a>
          </Link>,
          <Link href="/profile" key="following" prefetch>
            <a>
              <div>
                팔로잉
                <br />
                {me.Followings.length}
              </div>
            </a>
          </Link>,
          <Link href="/profile" key="follower" prefetch>
            <a>
              <div>
                팔로워
                <br />
                {me.Followers.length}
              </div>
            </a>
          </Link>,
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
