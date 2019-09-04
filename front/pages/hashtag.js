import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

/**
 * GET /hashtag/:tag
 * 해시태그로 게시글 검색 페이지
 */
const Hashtag = ({ tag }) => {
  const { mainPosts } = useSelector((state) => state.post);

  return (
    <div>
      {mainPosts.map((post) => (
        <PostCard key={+post.createdAt} post={post} />
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
