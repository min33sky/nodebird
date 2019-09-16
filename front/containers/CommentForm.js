import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector((state) => state.user);
  const { addedComment, isAddingComment } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    setCommentText(''); // 댓글 입력창 초기화
  }, [addedComment === true]);

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
          content: commentText,
        },
      });
    },
    [me && me.id, commentText],
  );

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  return (
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
          <Button type="primary" htmlType="submit" loading={isAddingComment}>
            작성
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

CommentForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
    Images: PropTypes.array,
    createdAt: PropTypes.string,
    Comments: PropTypes.array,
    RetweetId: PropTypes.number,
    Retweet: PropTypes.object,
  }).isRequired,
};

export default CommentForm;
