import React from 'react';
import {
 Card, Icon, Button, Avatar 
} from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => (
  // +를 변수앞에 붙이면 parseInt()를 대체할 수 있다.
  <Card
    key={+post.createdAt}
    cover={post.img && <img alt="example" src={post.img} />}
    actions={[
      <Icon type="retweet" key="retweet" />,
      <Icon type="heart" key="heart" />,
      <Icon type="message" key="message" />,
      <Icon type="ellipsis" key="ellipsis" />,
    ]}
    extra={<Button>팔로우</Button>}
  >
    <Card.Meta
      avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
      title={post.User.nickname}
      description={post.content}
    />
  </Card>
);
PostCard.propTypes = {
  // TODO: createdAt에 isRequired 추가
  post: PropTypes.shape({
    User: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    createdAt: PropTypes.object,
  }).isRequired,
};

export default PostCard;
