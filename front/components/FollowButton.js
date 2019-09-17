import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

const FollowButton = ({ post, onFollow, onUnfollow }) => {
  const { me } = useSelector((state) => state.user);

  return (
    // eslint-disable-next-line no-nested-ternary
    !me || post.User.id === me.id ? null : me.Followings.find(
        (v) => v.id === post.User.id,
      ) ? (
      <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
    ) : (
      <Button onClick={onFollow(post.User.id)}>팔로우</Button>
    )
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
};

FollowButton.defaultProps = {
  me: null,
};

export default FollowButton;
