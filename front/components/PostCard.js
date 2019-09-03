import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Card, Icon, Button, Avatar, List, Form, Input, Comment } from 'antd';
import PropTypes from 'prop-types';
import {
  ADD_COMMENT_REQUEST,
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from '../reducers/post';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';

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
  const liked = me && post.Likers && post.Likers.find((v) => v.id === me.id);

  // Lifecycle Function
  useEffect(() => {
    setCommentText('');
  }, [addedComment === true]);

  // 댓글 창 열기
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
    // 댓글창을 열때만 댓글들을 불러온다.
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        id: post.id,
      });
    }
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
          content: commentText,
        },
      });
    },
    [me && me.id, commentText],
  );

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  // 좋아요 토글
  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  /**
   * 리트윗
   */
  const onClickRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post && post.id]);

  /**
   * 팔로우
   */
  const onFollow = useCallback(
    (userId) => () => {
      // 팔로우
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  /**
   * 언팔로우
   */
  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  return (
    <div>
      <Card
        // '+'를 변수앞에 붙이면 parseInt()를 대체할 수 있다.
        key={+post.createdAt}
        cover={
          post.Images && post.Images[0] && <PostImages images={post.Images} />
        }
        actions={[
          <Icon type="retweet" key="retweet" onClick={onClickRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
        extra={
          // eslint-disable-next-line no-nested-ternary
          !me || post.User.id === me.id ? null : me.Followings.find(
              (v) => v.id === post.User.id,
            ) ? (
            <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
          ) : (
            <Button onClick={onFollow(post.User.id)}>팔로우</Button>
          )
        }
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link
                  // ! href={`/user/${post.User.id}`}는 프론트 주소가 아니라 서버주소
                  //   동적 라우팅이 안되기 때문에 라우팅을 express에서 처리하므로
                  //   프론트가 인식할 수 있는 주소로 바꿔준다..
                  // * as는 queryString 주소를 바꿔준다.
                  href={{
                    pathname: '/user',
                    query: { id: post.Retweet.User.id },
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />} // a tag x -> Link
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link
                href={{ pathname: '/user', query: { id: post.User.id } }}
                as={`/user/${post.User.id}`}
              >
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />} // a tag x -> Link
          />
        )}
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
                  avatar={
                    <Link
                      href={{ pathname: '/user', query: { id: post.User.id } }}
                      as={`/user/${post.User.id}`}
                    >
                      <Avatar>{item.User.nickname[0]}</Avatar>
                    </Link>
                  }
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
    Images: PropTypes.array,
    createdAt: PropTypes.object,
    Comments: PropTypes.array,
    RetweetId: PropTypes.number.isRequired,
    Retweet: PropTypes.object,
  }).isRequired,
};

export default PostCard;
