import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

/**
 * GET /hashtag/:tag
 * 해시태그로 게시글 검색 페이지
 */
const Hashtag = ({ tag }) => {
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const onScroll = useCallback(() => {
    if (
      // ! 길이 체크한 이유 : 스크롤바가 생성되지 않을 경우 이 함수가 바로 실행되는데
      // ! 그 때 배열에 아무것도 들어있지 않아서 undefined 에러가 발생한다.
      mainPosts.length !== 0 &&
      window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        dispatch({
          type: LOAD_HASHTAG_POSTS_REQUEST,
          lastId: mainPosts[mainPosts.length - 1].id,
          data: tag,
        });
      }
    }
  }, [mainPosts.length, hasMorePost]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePost]);

  return (
    <div>
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

Hashtag.propTypes = {
  tag: PropTypes.string.isRequired,
};

/**
 * 가장 먼저 실행되는 라이프사이클 함수 (Next)
 * - ComponentDidMount보다 먼저 실행되므로 SSR에서 활용한다.
 */
Hashtag.getInitialProps = async (context) => {
  // urldecode 해줘야된다.
  const { tag } = context.query;

  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag,
  });

  return {
    tag,
  };
};

export default Hashtag;
