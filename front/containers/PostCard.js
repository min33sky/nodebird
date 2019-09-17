import React, { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Card, Icon, Button, Avatar, List, Comment, Popover } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import {
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
  REMOVE_POST_REQUEST,
} from '../reducers/post';
import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';
import CommentForm from './CommentForm';
import FollowButton from '../components/FollowButton';

moment.locale('ko'); // moment 한글 설정

const CardWrapper = styled.div`
  margin-bottom: 40px;
`;

/**
 * 게시글 컴포넌트 & 댓글 컴포넌트
 * @param {Object} post 게시글
 */
const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me && state.user.me.id);
  const dispatch = useDispatch();
  const liked = id && post.Likers && post.Likers.find((v) => v.id === id);

  // ! 최적화 예제
  // * useRef는 DOM에 직접 접근 뿐만 아니라 랜더링 될 필요없는 변수를 저장하는 용도로도 사용한다.
  // const meMemory = useRef(me); // 이전 값 기억

  // useEffect(() => {
  // 출력이 된다면 me가 렌더링에 영향을 준다는 것이다.
  // 팔로우 버튼을 누르면 me.Followings가 바뀌기 때문에 랜더링이 발생하는데
  // me.Following을 여기서 사용을 안하기 때문에 me에서 필요한 것만 꺼내쓰는 것으로 수정한다.
  //   console.log('me useEffect', meMemory.current, me, meMemory.current === me);
  // }, [me]);

  // ******************************************************************************************* //

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

  // 좋아요 토글
  const onToggleLike = useCallback(() => {
    if (!id) {
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
  }, [id, post && post.id, liked]);

  /**
   * 리트윗
   */
  const onClickRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id, post && post.id]);

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

  /**
   * 포스트 삭제
   */
  const onRemovePost = useCallback(
    (postId) => () => {
      dispatch({
        type: REMOVE_POST_REQUEST,
        data: postId,
      });
    },
    [],
  );

  return (
    <CardWrapper>
      <Card
        // '+'를 객체앞에 붙이면 형 변환이 된다..
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
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.UserId === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" onClick={onRemovePost(post.id)}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <Icon type="ellipsis" />,
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
        extra={
          <FollowButton
            post={post}
            onUnfollow={onUnfollow}
            onFollow={onFollow}
          />
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
            <span style={{ float: 'right' }}>
              {moment(post.createdAt).format('YYYY.MM.DD.')}
            </span>
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
          <CommentForm post={post} />
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
                      href={`/user?id=${post.User.id}`}
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
    </CardWrapper>
  );
});

PostCard.propTypes = {
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

export default PostCard;
