import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LOAD_POST_REQUEST } from '../reducers/post';

/**
 * URL /post/:id
 * 하나의 게시물 페이지
 */
const Post = ({ id }) => {
  const { singlePost } = useSelector((state) => state.post);
  return (
    <>
      <Helmet
        title={`${singlePost.User.nickname}님의 글`}
        description={singlePost.content}
        meta={[
          {
            name: 'description',
            content: singlePost.content,
          },
          {
            property: 'og:title',
            content: `${singlePost.User.nickname}님의 게시글`,
          },
          {
            property: 'og:description',
            content: singlePost.content,
          },
          {
            property: 'og:image',
            content:
              singlePost.Images[0] &&
              `http://localhost:8080/${singlePost.Images[0].src}`,
          },
          {
            property: 'og:url',
            content: `http://localhost:3060/post/${id}`,
          },
        ]}
      />
      <div>{singlePost.content}</div>
      <div>{singlePost.User.nickname}</div>
      <div>
        {singlePost.Images[0] && (
          <img
            alt="img"
            src={`http://localhost:8080/${singlePost.Images[0].src}`}
          />
        )}
      </div>
    </>
  );
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
};

Post.getInitialProps = async (context) => {
  const { id } = context.query;
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });

  return { id };
};

export default Post;
