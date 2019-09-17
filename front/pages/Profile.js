import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import NicknameEditForm from '../containers/NicknameEditForm';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import FollowList from '../components/FollowList';

/**
 * GET /profile
 * 프로필 페이지
 */
const Profile = () => {
  const dispatch = useDispatch();
  const {
    followerList,
    followingList,
    hasMoreFollower,
    hasMoreFollowing,
  } = useSelector((state) => state.user);
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

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  return (
    <div>
      <NicknameEditForm />
      <FollowList
        header="팔로잉"
        data={followingList}
        hasMore={hasMoreFollowing}
        onClickMore={loadMoreFollowings}
        onClickStop={unFollow}
      />
      <FollowList
        header="팔로워"
        data={followerList}
        hasMore={hasMoreFollower}
        onClickMore={loadMoreFollowers}
        onClickStop={removeFollower}
      />
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
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
