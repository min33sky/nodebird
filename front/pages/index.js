import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

/**
 * GET /
 * 메인 페이지
 */
const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  // Test
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'HELLO_SAGA',
    });
    dispatch({
      type: 'HELLO_SAGA',
    });
    dispatch({
      type: 'HELLO_SAGA',
    });
  }, []);

  return (
    <div>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key="c" post={c} />
      ))}
    </div>
  );
};

export default Home;
