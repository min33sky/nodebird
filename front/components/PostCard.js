import React, {
 useState, useCallback, useEffect, useRef 
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
 Card, Icon, Button, Avatar, List, Form, Input, Comment 
} from 'antd';
import PropTypes from 'prop-types';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

/**
 * 게시글 컴포넌트 & 댓글 컴포넌트
 * @param {Object} post 게시글
 */
const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector((state) => state.user);
  const { addedComment, isAddingComment } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  // Lifecycle Function
  useEffect(() => {
    setCommentText('');
  }, [addedComment === true]);

  // 댓글 창 열기
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onSubmitComment = useCallback(
    (e) => {
      e.preventDefault();
      if (!me) {
        return alert('로그인이 필요한 서비스입니다.');
      }
      return dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id,
        },
      });
    },
    [me && me.id],
  );

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        // '+'를 변수앞에 붙이면 parseInt()를 대체할 수 있다.
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
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
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea
                rows={4}
                value={commentText}
                onChange={onChangeCommentText}
                placeholder={!me ? '로그인이 필요해요😘' : '댓글을 남기세요'}
                disabled={!me}
                autoFocus
              />
              <Button
                type="primary"
                htmlType="submit"
                loading={isAddingComment}
              >
                작성
              </Button>
            </Form.Item>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  // TODO: createdAt에 isRequired 추가
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    createdAt: PropTypes.object,
    Comments: PropTypes.array,
  }).isRequired,
};

export default PostCard;
