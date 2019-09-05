import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import NicknameEditForm from '../components/NicknameEditForm';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

/**
 * GET /profile
 * 프로필 페이지
 */
const Profile = () => {
  const dispatch = useDispatch();
  const { followerList, followingList } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  const unFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const removeFollower = useCallback(
    (userId) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  return (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로우 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        dataSource={followingList}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card
              actions={[
                <Icon key="stop" type="stop" onClick={unFollow(item.id)} />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        dataSource={followerList}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card
              actions={[
                <Icon
                  key="stop"
                  type="stop"
                  onClick={removeFollower(item.id)}
                />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
      {mainPosts.map((c) => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

Profile.getInitialProps = async (context) => {
  const state = context.store.getState();
  // 이 직전에 _app의 LOAD_USERS_REQUEST 호출 (me가 null인 상태)
  // data에 null이 들어가므로 에러가 발생.
  // 그래서 사가와 라우터에서 별도의 처리 필요 (null을 0으로 변환해서 서버에서 0을 me라고 인식하게 함)
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  // LOAD_USERS_SUCCESS 응답이 와서 me가 생김
};

export default Profile;
