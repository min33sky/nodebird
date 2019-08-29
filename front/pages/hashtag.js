import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
  const { mainPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: tag,
    });
  }, []);

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
  console.log('getInitialProps: ', context.query.tag);
  return {
    tag: context.query.tag,
  };
};

export default Hashtag;
